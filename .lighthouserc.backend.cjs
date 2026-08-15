module.exports = {
  ci: {
    collect: {
      url: [
        // 목록·이미지·API 요청이 많은 메인 화면
        // 'http://localhost/posts',
        // // 댓글 등 가장 복잡한 화면
        // 'http://localhost/posts/1',
        // // 별도의 목록 UI
        // 'http://localhost/tech-enterprises',
        // 'http://127.0.0.1:4173/tech-enterprises',
        // 'http://127.0.0.1:4173/tech-enterprises/naver',
      ],
      numberOfRuns: 3,
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'Local',
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },

    // 기존 assert와 upload 설정 복사
  },
}
