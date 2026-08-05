const HANGUL_FIRST = 0xac00
const HANGUL_LAST = 0xd7a3

const hasFinalConsonant = (word) => {
  const code = String(word).trim().slice(-1).charCodeAt(0)

  if (!(code >= HANGUL_FIRST && code <= HANGUL_LAST)) {
    return true
  }

  return (code - HANGUL_FIRST) % 28 !== 0
}

export const withObjectParticle = (word) =>
  `${word}${hasFinalConsonant(word) ? '을' : '를'}`

export const withSubjectParticle = (word) =>
  `${word}${hasFinalConsonant(word) ? '이' : '가'}`
