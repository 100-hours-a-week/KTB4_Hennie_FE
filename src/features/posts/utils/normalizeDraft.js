import { toCount } from '../../../shared/utils/countValue'

export const normalizeDraft = (draft = {}) => ({
  id: draft.postId ?? draft.id ?? null,
  title: draft.title || '',
  content: draft.content || '',
  category: draft.category || null,
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
