import { del, get, patch, post, put } from '../../../shared/api/http'
import { normalizePostDetail, normalizePostList } from '../utils/normalizePost'
import { normalizeDraft, normalizeDraftList } from '../utils/normalizeDraft'
import { DEFAULT_POST_PAGE_SIZE } from '../../../shared/utils/constants'

const DEFAULT_POST_PAGE = 1

export const getPostList = async (
  { page = DEFAULT_POST_PAGE, size = DEFAULT_POST_PAGE_SIZE } = {},
  options = {},
) => {
  const response = await get('/posts', {
    ...options,
    auth: 'optional',
    params: {
      page,
      size,
    },
  })

  return normalizePostList(response?.data)
}

export const getPost = async (postId, options = {}) => {
  const response = await get(`/posts/${postId}`, {
    ...options,
    auth: 'optional',
  })

  return response?.data ? normalizePostDetail(response.data) : null
}

export const deletePost = (postId) =>
  del(`/posts/${postId}`, {
    auth: true,
  })

export const updatePost = (postId, { title, content, imageUrl }) =>
  patch(
    `/posts/${postId}`,
    {
      title,
      content,
      ...(imageUrl ? { imageUrl } : {}),
    },
    {
      auth: true,
    },
  )

export const likePost = (postId) =>
  post(`/posts/${postId}/likes`, undefined, {
    auth: true,
  })

export const unlikePost = (postId) =>
  del(`/posts/${postId}/likes`, {
    auth: true,
  })

export const reportPost = (postId, { reason }) =>
  post(
    `/posts/${postId}/reports`,
    { reason },
    {
      auth: true,
    },
  )

export const createPost = ({ postId, title, content, imageUrl }) =>
  post(
    '/posts',
    {
      ...(postId ? { postId: Number(postId) } : {}),
      title,
      content,
      images: imageUrl ? [imageUrl] : [],
    },
    { auth: true },
  )

export const getDraftList = async (options = {}) => {
  const response = await get('/posts/drafts', { ...options, auth: true })

  return normalizeDraftList(response?.data)
}

export const getDraft = async (postId) => {
  const response = await get(`/posts/drafts/${postId}`, { auth: true })

  return normalizeDraft(response?.data)
}

export const saveDraft = async ({ title, content, image }) => {
  const response = await post(
    '/posts/drafts',
    {
      title,
      content,
      ...(image ? { image } : {}),
    },
    { auth: true },
  )

  return normalizeDraft(response?.data)
}

export const updateDraft = async (postId, { title, content, image }) => {
  const response = await put(
    `/posts/drafts/${postId}`,
    {
      title,
      content,
      ...(image ? { image } : {}),
    },
    { auth: true },
  )

  return normalizeDraft(response?.data)
}

export const deleteDraft = (postId) =>
  del(`/posts/drafts/${postId}`, { auth: true })
