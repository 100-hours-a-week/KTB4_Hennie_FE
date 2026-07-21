import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteDraft,
  getDraft,
  getDraftList,
  saveDraft,
  updateDraft,
} from '../api/postApi'
import { MAX_DRAFT_COUNT } from '../utils/normalizeDraft'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'

export const usePostDrafts = ({
  enabled,
  title,
  content,
  setFormError,
  loadDraftIntoForm,
}) => {
  const [draftPostId, setDraftPostId] = useState(null)
  const [drafts, setDrafts] = useState([])
  const [draftCount, setDraftCount] = useState(0)
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false)
  const [loadingDraftId, setLoadingDraftId] = useState(null)
  const [deletingDraftId, setDeletingDraftId] = useState(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const isLoadingDraftsRef = useRef(false)
  const isLoadingDraftRef = useRef(false)
  const isDeletingDraftRef = useRef(false)
  const isSavingRef = useRef(false)
  const hasLoadedDraftsRef = useRef(false)
  const requestIdRef = useRef(0)

  // 목록과 개수는 동일 엔드포인트(GET /posts/drafts)에서 함께 오므로 한 번에 채운다.
  const refreshDrafts = useCallback(async (options) => {
    const requestId = ++requestIdRef.current
    const result = await getDraftList(options)

    if (requestId === requestIdRef.current) {
      setDrafts(result.drafts)
      setDraftCount(result.totalCount)
      hasLoadedDraftsRef.current = true
    }

    return result
  }, [])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    let isActive = true
    const controller = new AbortController()

    queueMicrotask(() => {
      if (!isActive) {
        return
      }

      refreshDrafts({ signal: controller.signal }).catch((error) => {
        if (error?.name !== 'AbortError') {
          console.error('임시저장 목록 조회 실패', error)
        }
      })
    })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [enabled, refreshDrafts])

  const loadDraftsForModal = async () => {
    // 마운트 시(또는 저장 후) 받아둔 목록을 재사용해 중복 조회를 피한다.
    if (hasLoadedDraftsRef.current) {
      return true
    }

    if (isLoadingDraftsRef.current) {
      return false
    }

    isLoadingDraftsRef.current = true
    setIsLoadingDrafts(true)

    try {
      await refreshDrafts()
      return true
    } catch (error) {
      console.error('임시저장 목록 조회 실패', error)
      alert(
        getHttpErrorMessage(error, {
          forbidden: '임시저장 목록을 조회할 권한이 없습니다.',
          fallback: '임시저장 목록을 불러오지 못했습니다.',
        }),
      )
      return false
    } finally {
      isLoadingDraftsRef.current = false
      setIsLoadingDrafts(false)
    }
  }

  const selectDraft = async (postId) => {
    if (
      !postId ||
      isLoadingDraftRef.current ||
      isDeletingDraftRef.current ||
      isSavingRef.current
    ) {
      return false
    }

    isLoadingDraftRef.current = true
    setLoadingDraftId(postId)

    try {
      const draft = await getDraft(postId)

      setDraftPostId(draft.id ?? postId)
      loadDraftIntoForm(draft)
      return true
    } catch (error) {
      console.error('임시저장 조회 실패', error)

      if (error?.status === 404) {
        alert('임시저장 글을 찾을 수 없습니다.')
        refreshDrafts().catch((refreshError) => {
          console.error('임시저장 목록 갱신 실패', refreshError)
        })
      } else {
        alert(
          getHttpErrorMessage(error, {
            forbidden: '임시저장 글을 조회할 권한이 없습니다.',
            fallback: '임시저장 글을 불러오지 못했습니다.',
          }),
        )
      }

      return false
    } finally {
      isLoadingDraftRef.current = false
      setLoadingDraftId(null)
    }
  }

  const removeDraftFromState = (postId) => {
    setDrafts((currentDrafts) =>
      currentDrafts.filter((draft) => String(draft.id) !== String(postId)),
    )
    setDraftCount((currentCount) => Math.max(0, currentCount - 1))
  }

  const removeDraft = async (postId) => {
    if (
      !postId ||
      isLoadingDraftRef.current ||
      isDeletingDraftRef.current ||
      isSavingRef.current
    ) {
      return
    }

    isDeletingDraftRef.current = true
    setDeletingDraftId(postId)

    try {
      await deleteDraft(postId)

      if (String(draftPostId) === String(postId)) {
        setDraftPostId(null)
      }

      removeDraftFromState(postId)
    } catch (error) {
      console.error('임시저장 삭제 실패', error)

      if (error?.status === 404) {
        if (String(draftPostId) === String(postId)) {
          setDraftPostId(null)
        }

        removeDraftFromState(postId)
        hasLoadedDraftsRef.current = false
        alert('이미 삭제되었거나 존재하지 않는 임시저장 글입니다.')
      } else {
        alert(
          getHttpErrorMessage(error, {
            forbidden: '임시저장 글을 삭제할 권한이 없습니다.',
            fallback: '임시저장 삭제에 실패했습니다.',
          }),
        )
      }
    } finally {
      isDeletingDraftRef.current = false
      setDeletingDraftId(null)
    }
  }

  const saveCurrentDraft = async () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    setFormError('')

    if (!trimmedTitle && !trimmedContent) {
      setFormError('제목 또는 내용을 작성해주세요')
      return
    }

    if (isSavingRef.current) {
      return
    }

    isSavingRef.current = true
    setIsSavingDraft(true)

    try {
      const isNewDraft = draftPostId === null

      if (isNewDraft) {
        const { totalCount } = await refreshDrafts()

        if (totalCount >= MAX_DRAFT_COUNT) {
          alert(`임시저장은 최대 ${MAX_DRAFT_COUNT}개까지 가능합니다.`)
          return
        }
      }

      const payload = {
        title: trimmedTitle,
        content: trimmedContent,
      }
      const savedDraft = isNewDraft
        ? await saveDraft(payload)
        : await updateDraft(draftPostId, payload)
      const savedDraftId = savedDraft.id ?? draftPostId

      setDraftPostId(savedDraftId)

      if (savedDraftId === null) {
        console.warn(
          '임시저장 응답에서 postId를 확인할 수 없습니다.',
          savedDraft,
        )
      }

      // lazy refetch: 저장 직후 목록을 GET하지 않고 캐시를 stale로 표시한다.
      // 목록은 모달을 다시 열 때(loadDraftsForModal)만 재조회되고,
      // 배지 개수는 신규 저장일 때만 응답으로 로컬 갱신한다.
      hasLoadedDraftsRef.current = false
      if (isNewDraft) {
        setDraftCount((prev) => Math.min(prev + 1, MAX_DRAFT_COUNT))
      }

      alert('임시저장되었습니다.')
    } catch (error) {
      console.error('임시저장 실패', error)

      if (error?.status === 400) {
        setFormError('제목 또는 내용을 작성해주세요')
      } else if (error?.status === 404) {
        setDraftPostId(null)
        alert('임시저장 글을 찾을 수 없습니다. 다시 임시저장해주세요.')
      } else {
        alert(
          getHttpErrorMessage(error, {
            forbidden: '임시저장 글을 작성할 권한이 없습니다.',
            fallback: '임시저장에 실패했습니다.',
          }),
        )
      }
    } finally {
      isSavingRef.current = false
      setIsSavingDraft(false)
    }
  }

  return {
    draftPostId,
    drafts,
    draftCount,
    isLoadingDrafts,
    loadingDraftId,
    deletingDraftId,
    isSavingDraft,
    saveCurrentDraft,
    loadDraftsForModal,
    selectDraft,
    removeDraft,
  }
}
