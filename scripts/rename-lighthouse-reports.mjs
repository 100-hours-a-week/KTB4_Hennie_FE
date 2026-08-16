// LHCI filesystem 업로드는 %%DATETIME%%을 UTC로만 기록하고, 어떤 실행이
// 대표(중앙값)인지 파일명으로 알려주지 않는다. 측정이 끝난 뒤 manifest를 읽어
// 배치별 하위 폴더(run-HH_MM_SS)로 모으고, 파일명을 한국 시간 + Performance
// 점수(-perf91)로 바꾸고, 대표 실행과 지표를 정리한 SUMMARY.md를 만든다.
// 같은 폴더에 다시 실행해도 안전하다.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const reportsRoot = path.resolve(process.argv[2] ?? '.lighthouseci/reports')

const sanitize = (value) => value.replace(/[^a-z0-9]+/gi, '_').replace(/^_/, '')

const toKst = (fetchTime) =>
  new Date(fetchTime).toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })

const moveEntryFile = (fromPath, toPath) => {
  if (fromPath === toPath) return false
  if (!fs.existsSync(fromPath)) return false
  fs.renameSync(fromPath, toPath)
  return true
}

if (!fs.existsSync(reportsRoot)) {
  console.log(`보고서 폴더가 없어 건너뜀: ${reportsRoot}`)
  process.exit(0)
}

const manifestPaths = fs
  .readdirSync(reportsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(reportsRoot, entry.name, 'manifest.json'))
  .filter((manifestPath) => fs.existsSync(manifestPath))

let movedCount = 0

for (const manifestPath of manifestPaths) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const runs = []
  let manifestChanged = false

  for (const entry of manifest) {
    if (!fs.existsSync(entry.jsonPath)) continue

    const lhr = JSON.parse(fs.readFileSync(entry.jsonPath, 'utf8'))
    runs.push({ entry, lhr })
  }

  if (!runs.length) continue

  // 같은 manifest의 실행들은 한 배치이므로 가장 이른 측정 시각으로 폴더를 정한다.
  const batchKst = runs.map(({ lhr }) => toKst(lhr.fetchTime)).sort()[0]
  const batchDir = path.join(
    path.dirname(manifestPath),
    `run-${sanitize(batchKst.slice(11))}`,
  )
  fs.mkdirSync(batchDir, { recursive: true })

  for (const run of runs) {
    const { entry, lhr } = run
    const url = new URL(entry.url)
    const perfScore = Math.round(
      (lhr.categories?.performance?.score ?? 0) * 100,
    )
    const baseName = `${sanitize(url.hostname)}-${sanitize(url.pathname)}-${sanitize(toKst(lhr.fetchTime))}-perf${perfScore}`
    const nextJsonPath = path.join(batchDir, `${baseName}.report.json`)
    const nextHtmlPath = path.join(batchDir, `${baseName}.report.html`)

    if (moveEntryFile(entry.jsonPath, nextJsonPath)) movedCount += 1
    if (moveEntryFile(entry.htmlPath, nextHtmlPath)) movedCount += 1
    if (entry.jsonPath !== nextJsonPath || entry.htmlPath !== nextHtmlPath) {
      entry.jsonPath = nextJsonPath
      entry.htmlPath = nextHtmlPath
      manifestChanged = true
    }
    run.fileName = `${baseName}.report.html`
  }

  const summaryRows = runs
    .toSorted(
      (a, b) =>
        a.entry.url.localeCompare(b.entry.url) ||
        a.lhr.fetchTime.localeCompare(b.lhr.fetchTime),
    )
    .map(({ entry, lhr, fileName }) => {
      const audit = (id) => lhr.audits?.[id]?.displayValue ?? '-'
      const median = entry.isRepresentativeRun ? '✅ 대표(중앙값)' : ''
      return `| ${fileName} | ${Math.round((lhr.categories?.performance?.score ?? 0) * 100)} | ${median} | ${audit('largest-contentful-paint')} | ${audit('cumulative-layout-shift')} | ${audit('total-byte-weight')} |`
    })
    .join('\n')
  const summary = [
    `# ${path.basename(batchDir)} 측정 요약`,
    '',
    `- 측정 시각(KST): ${batchKst}`,
    `- URL: ${[...new Set(runs.map(({ entry }) => entry.url))].join(', ')}`,
    '',
    '| 파일 | Perf | 대표 실행 | LCP | CLS | 전송량 |',
    '| --- | ---: | --- | ---: | ---: | --- |',
    summaryRows,
    '',
    '점수 비교는 대표(중앙값) 실행 기준으로 한다.',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(batchDir, 'SUMMARY.md'), summary)

  if (manifestChanged) {
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  }
}

console.log(`배치 폴더로 정리한 파일: ${movedCount}개`)
