export const formatDate = (date) => {
  if (!date) {
    return ''
  }

  return String(date).replace('T', ' ').slice(0, 19)
}
