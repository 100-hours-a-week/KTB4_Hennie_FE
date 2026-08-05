export const truncateText = (text, maxLength) => {
  const value = String(text ?? '')

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}
