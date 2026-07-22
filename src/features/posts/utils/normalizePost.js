import { DEFAULT_PROFILE_PATH } from '../../../shared/utils/constants'

const toCount = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

export const normalizePost = (post = {}) => ({
  id: post.postId ?? post.id ?? null,
  title: post.title || '제목 없음',
  authorNickname:
    post.nickname || post.authorNickname || post.author?.nickname || '익명',
  authorProfileUrl:
    post.authorProfileUrl ||
    post.profileUrl ||
    post.author?.profileUrl ||
    DEFAULT_PROFILE_PATH,
  createdAt: post.createdAt || '',
  likeCount: toCount(post.likeCount ?? post.likes),
  commentCount: toCount(post.commentCount),
  viewCount: toCount(post.viewCount ?? post.views),
})

export const normalizeComment = (comment = {}) => ({
  id: comment.commentId ?? null,
  authorNickname: comment.nickname || '익명',
  authorProfileUrl: DEFAULT_PROFILE_PATH,
  content: comment.content || '',
  createdAt: comment.createdAt || '',
  edited: Boolean(comment.edited),
  deleted: Boolean(comment.deleted),
  replies: (Array.isArray(comment.replies) ? comment.replies : []).map(
    normalizeComment,
  ),
})

export const normalizePostDetail = (post = {}) => {
  const comments = Array.isArray(post.comments) ? post.comments : []
  const normalizedComments = comments.map(normalizeComment)
  const images = Array.isArray(post.images) ? post.images : []

  return {
    id: post.postId ?? null,
    title: post.title || '제목 없음',
    authorNickname: post.nickname || '익명',
    authorProfileUrl: DEFAULT_PROFILE_PATH,
    content: post.content || '',
    images,
    imageUrl: images[0] || '',
    createdAt: post.createdAt || '',
    modifiedAt: post.modifiedAt || '',
    edited: Boolean(post.edited),
    likeCount: toCount(post.likeCount),
    liked: Boolean(post.liked),
    commentCount: toCount(post.commentCount),
    viewCount: toCount(post.viewCount),
    blinded: Boolean(post.blinded),
    reportCount: toCount(post.reportCount),
    status: post.status || '',
    comments: normalizedComments,
  }
}

export const normalizePostList = (data = {}) => ({
  posts: (Array.isArray(data.posts) ? data.posts : []).map(normalizePost),
  pagination: {
    page: toCount(data.page) || 1,
    size: toCount(data.size) || 10,
    totalCount: toCount(data.totalCount),
    totalPages: toCount(data.totalPages) || 1,
    hasNext: Boolean(data.hasNext),
  },
})
