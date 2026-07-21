import { del, get, post, put } from '../../../shared/api/http'
import { normalizePostList } from '../utils/normalizePost'
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
