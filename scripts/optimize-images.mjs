import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const TARGETS = [
  {
    source: 'public/assets/thumbnail/thumbnail_fe.png',
    width: 320,
    height: 180,
  },
  {
    source: 'public/assets/thumbnail/thumbnail_be.png',
    width: 320,
    height: 180,
  },
  {
    source: 'public/assets/thumbnail/thumbnail_ai.png',
    width: 320,
    height: 180,
  },
  {
    source: 'public/assets/thumbnail/thumbnail_default.png',
    width: 320,
    height: 180,
  },
  { source: 'public/assets/profile-default.jpeg', width: 224, height: 224 },
  // 로고는 쓰임새마다 크기가 달라 두 벌로 나눈다. 앱은 헤더에서 최대 44px 높이로
  // 쓰고, README는 GitHub에서 280px 폭으로 렌더한다. README용을 public 밖에 두어
  // 빌드 결과물에는 앱용 한 벌만 들어가게 한다.
  { source: 'public/assets/logo.png', width: 186 },
  { source: 'public/assets/logo.png', output: 'docs/logo.webp', width: 560 },
]

const WEBP_QUALITY = 85

const toKb = (bytes) => Math.round(bytes / 1024)

const formatRow = (label, before, after) => {
  const saved = before === 0 ? 0 : Math.round((1 - after / before) * 100)
  return `${label.padEnd(46)} ${String(toKb(before)).padStart(6)} KB → ${String(
    toKb(after),
  ).padStart(5)} KB  (${String(saved).padStart(3)}% ↓)`
}

const optimize = async ({ source, output, width, height }) => {
  if (!fs.existsSync(source)) {
    console.log(`원본이 없어 건너뜀: ${source}`)
    return null
  }

  const beforeSize = fs.statSync(source).size
  const target = output ?? source.replace(path.extname(source), '.webp')

  fs.mkdirSync(path.dirname(target), { recursive: true })

  await sharp(source)
    .resize({ width, height, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(target)

  const afterSize = fs.statSync(target).size

  console.log(formatRow(target, beforeSize, afterSize))
  return { source, beforeSize, afterSize }
}

const results = []

for (const target of TARGETS) {
  results.push(await optimize(target))
}

const changed = results.filter(Boolean)

// 한 원본이 여러 결과물을 만들 수 있어 변환을 모두 끝낸 뒤에 지운다.
for (const source of new Set(changed.map((r) => r.source))) {
  if (fs.existsSync(source) && path.extname(source) !== '.webp') {
    fs.unlinkSync(source)
  }
}

if (changed.length === 0) {
  console.log('변환할 이미지가 없습니다.')
  process.exit(0)
}

// 한 원본에서 여러 결과물이 나오면 원본 용량은 한 번만 센다.
const sizeBySource = new Map(changed.map((r) => [r.source, r.beforeSize]))
const totalBefore = [...sizeBySource.values()].reduce((sum, n) => sum + n, 0)
const totalAfter = changed.reduce((sum, r) => sum + r.afterSize, 0)

console.log('-'.repeat(78))
console.log(
  formatRow(`합계 (원본 ${sizeBySource.size}개)`, totalBefore, totalAfter),
)
