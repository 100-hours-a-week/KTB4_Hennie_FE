export const toCount = (value) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 ? number : 0
}
