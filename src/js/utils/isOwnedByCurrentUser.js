export const isOwnedByCurrentUser = (
  resource,
  { id: currentUserId, nickname: currentUserNickname } = {}
) => {
  if (!resource) {
    return false;
  }

  const ownershipFlag =
    resource.isMine ??
    resource.mine ??
    resource.ownedByMe ??
    resource.isAuthor ??
    resource.isOwner ??
    resource.canEdit;

  if (typeof ownershipFlag === "boolean") {
    return ownershipFlag;
  }

  const authorId =
    resource.authorId ??
    resource.writerId ??
    resource.ownerId ??
    resource.userId ??
    resource.memberId ??
    resource.createdBy ??
    resource.author?.id ??
    resource.author?.userId ??
    resource.writer?.userId ??
    resource.user?.id ??
    resource.writer?.id ??
    resource.owner?.id ??
    resource.member?.id ??
    (typeof resource.author !== "object" ? resource.author : null);

  if (authorId != null && currentUserId != null) {
    return String(authorId) === String(currentUserId);
  }

  const authorNickname =
    resource.authorNickname ??
    resource.nickname ??
    resource.author?.nickname ??
    resource.writer?.nickname;

  return (
    authorNickname != null &&
    currentUserNickname != null &&
    authorNickname === currentUserNickname
  );
};
