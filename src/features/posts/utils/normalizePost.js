import {
  DEFAULT_PROFILE_PATH,
  UNKNOWN_AUTHOR_NAME,
  UNTITLED_TITLE,
} from '../../../shared/utils/constants'
import { toCount } from '../../../shared/utils/countValue'

const normalizeReplyTarget = (target) => {
  if (!target) {
    return null
  }

  return {
    commentId: target.commentId ?? null,
    authorId: target.authorId ?? null,
    nickname: target.nickname || UNKNOWN_AUTHOR_NAME,
    deleted: Boolean(target.deleted),
  }
}

export const normalizePost = (post = {}) => ({
  id: post.postId ?? post.id ?? null,
  title: post.title || UNTITLED_TITLE,
  category: post.category || null,
  authorNickname:
    post.nickname ||
    post.authorNickname ||
    post.author?.nickname ||
    UNKNOWN_AUTHOR_NAME,
  authorProfileUrl: post.profileUrl || DEFAULT_PROFILE_PATH,
  createdAt: post.createdAt || '',
  likeCount: toCount(post.likeCount ?? post.likes),
  commentCount: toCount(post.commentCount),
  viewCount: toCount(post.viewCount ?? post.views),
})

export const normalizeComment = (comment = {}) => ({
  id: comment.commentId ?? comment.replyId ?? null,
  authorId: comment.authorId ?? null,
  authorNickname: comment.nickname || UNKNOWN_AUTHOR_NAME,
  authorProfileUrl: comment.profileUrl || DEFAULT_PROFILE_PATH,
  replyTo: normalizeReplyTarget(comment.replyTo),
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

  return {
    id: post.postId ?? null,
    title: post.title || UNTITLED_TITLE,
    authorNickname: post.nickname || UNKNOWN_AUTHOR_NAME,
    authorProfileUrl: post.profileUrl || DEFAULT_PROFILE_PATH,
    content: post.content || '',
    category: post.category || null,
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
