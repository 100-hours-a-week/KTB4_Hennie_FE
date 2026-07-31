import { del, patch, post } from '../../../shared/api/http'
import { normalizeComment } from '../utils/normalizePost'

export const createComment = async (postId, { content }) => {
  const response = await post(
    `/posts/${postId}/comments`,
    { content },
    {
      auth: true,
    },
  )

  return normalizeComment(response?.data)
}

export const deleteComment = (postId, commentId) =>
  del(`/posts/${postId}/comments/${commentId}`, {
    auth: true,
  })

export const updateComment = async (postId, commentId, { content }) => {
  const response = await patch(
    `/posts/${postId}/comments/${commentId}`,
    { content },
    {
      auth: true,
    },
  )

  return normalizeComment(response?.data)
}

export const createReply = async (
  postId,
  commentId,
  { content, replyToId },
) => {
  const response = await post(
    `/posts/${postId}/comments/${commentId}/replies`,
    { content, replyToId },
    {
      auth: true,
    },
  )

  return normalizeComment(response?.data)
}

export const updateReply = async (postId, commentId, replyId, { content }) => {
  const response = await patch(
    `/posts/${postId}/comments/${commentId}/replies/${replyId}`,
    { content },
    {
      auth: true,
    },
  )

  return normalizeComment(response?.data)
}

export const deleteReply = (postId, commentId, replyId) =>
  del(`/posts/${postId}/comments/${commentId}/replies/${replyId}`, {
    auth: true,
  })
