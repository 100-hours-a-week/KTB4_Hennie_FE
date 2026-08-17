const today = new Date().toLocaleDateString('sv-SE', {
  timeZone: 'Asia/Seoul',
})

module.exports = {
  ci: {
    collect: {
      // 백엔드(localhost:8080)가 떠 있어야 실제 데이터가 렌더링된다.
      // vite preview는 server.proxy 설정을 그대로 물려받아 /api를 프록시한다.
      // 게시글 상세는 댓글이 가장 많은 1번 게시글을 고정 대상으로 쓴다.
      url: ['http://127.0.0.1:4173/posts', 'http://127.0.0.1:4173/posts/1'],
      numberOfRuns: 3,
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'Local',
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'cumulative-layout-shift': [
          'error',
          { maxNumericValue: 0.1, aggregationMethod: 'median' },
        ],
        'largest-contentful-paint': [
          'warn',
          { maxNumericValue: 2500, aggregationMethod: 'median' },
        ],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouseci/reports/${today}-posts`,
      reportFilenamePattern:
        '%%HOSTNAME%%-%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
}
