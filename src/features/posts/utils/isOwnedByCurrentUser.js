export const isOwnedByCurrentUser = (resource, currentUser) => {
  if (resource?.authorId != null && currentUser?.id != null) {
    return String(resource.authorId) === String(currentUser.id)
  }

  return Boolean(
    resource?.authorNickname &&
    currentUser?.nickname &&
    resource.authorNickname === currentUser.nickname,
  )
}
