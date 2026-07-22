export const isOwnedByCurrentUser = (resource, currentUser) => {
  return Boolean(
    resource?.authorNickname &&
    currentUser?.nickname &&
    resource.authorNickname === currentUser.nickname,
  )
}
