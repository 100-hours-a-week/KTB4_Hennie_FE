import { DEFAULT_PROFILE_PATH } from '../../../shared/utils/constants'

const toCount = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

export const normalizePost = (post = {}) => ({
  id: post.postId ?? post.id ?? null,
  title: post.title || '제목 없음',
  authorNickname: post.nickname || post.authorNickname || '',
  authorProfileUrl: DEFAULT_PROFILE_PATH,
  createdAt: post.createdAt || '',
  likeCount: toCount(post.likeCount),
  commentCount: toCount(post.commentCount),
  viewCount: toCount(post.viewCount),
})

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
