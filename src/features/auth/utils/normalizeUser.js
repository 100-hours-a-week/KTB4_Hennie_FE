export const normalizeUser = (user) => {
  if (!user || user.id == null) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    nickname: user.nickname || '',
    profileUrl: user.profileUrl || null,
  }
}
