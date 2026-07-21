export const MAX_DRAFT_COUNT = 10

const toCount = (value) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 ? number : 0
}

export const normalizeDraft = (draft = {}) => ({
  id: draft.postId ?? draft.id ?? null,
  title: draft.title || '',
  content: draft.content || '',
  images: Array.isArray(draft.images) ? draft.images : [],
  status: draft.status || 'DRAFT',
  createdAt: draft.createdAt || '',
  modifiedAt: draft.modifiedAt || '',
})

export const normalizeDraftList = (response = {}) => {
  const data = response?.data ?? response
  const drafts = (Array.isArray(data.drafts) ? data.drafts : []).map(
    normalizeDraft,
  )

  return {
    drafts,
    totalCount: toCount(data.totalCount) || drafts.length,
  }
}
