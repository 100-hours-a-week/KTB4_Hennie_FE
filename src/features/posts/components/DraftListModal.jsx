import { useEffect, useEffectEvent, useRef } from 'react'
import { formatDate } from '../utils/formatDate'

function DraftListModal({
  isOpen,
  drafts = [],
  editingDraftId = null,
  loadingDraftId = null,
  deletingDraftId = null,
  onClose,
  onSelect,
  onDelete,
}) {
  const closeButtonRef = useRef(null)
  const isPending = Boolean(loadingDraftId || deletingDraftId)

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isPending) {
      onClose()
    }
  }

  const closeFromEffect = useEffectEvent(() => {
    if (!isPending) {
      onClose()
    }
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeFromEffect()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="w-full max-w-[420px] rounded-lg border border-app-border bg-app-surface p-6 shadow-dropdown"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-list-title"
        aria-busy={isPending}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold" id="draft-list-title">
            임시 저장 목록
          </h2>
          <button
            className="flex size-8 items-center justify-center rounded-full text-xl leading-none text-app-text-muted hover:bg-app-surface-raised hover:text-app-text focus-visible:outline-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
            ref={closeButtonRef}
            type="button"
            aria-label="임시 저장 목록 닫기"
            disabled={isPending}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {drafts.length === 0 ? (
          <p className="py-6 text-center text-sm text-app-text-muted">
            임시 저장된 글이 없습니다.
          </p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {drafts.map((draft) => {
              const postId = draft.id
              const isLoading = String(loadingDraftId) === String(postId)
              const isDeleting = String(deletingDraftId) === String(postId)
              const isEditing = String(editingDraftId) === String(postId)

              return (
                <li
                  className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_80px] overflow-hidden rounded-md border border-app-border bg-app-surface"
                  key={postId}
                >
                  <button
                    className="flex min-w-0 flex-col justify-center p-3 text-left hover:bg-app-surface-raised disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    disabled={isPending || isEditing || !onSelect}
                    onClick={() => onSelect?.(postId)}
                  >
                    <span className="mb-1 truncate text-sm font-bold text-app-text">
                      {isLoading
                        ? '불러오는 중...'
                        : draft.title || '제목 없음'}
                    </span>
                    <span className="truncate text-xs text-app-text-muted">
                      {formatDate(draft.modifiedAt || draft.createdAt)}
                    </span>
                  </button>
                  <div className="flex items-center justify-center">
                    {isEditing ? (
                      <span className="text-xs font-medium text-app-primary">
                        편집중
                      </span>
                    ) : (
                      <button
                        className="h-8 w-14 rounded-md bg-app-error/15 text-xs font-medium text-app-error hover:bg-app-error/25 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        disabled={isPending || !onDelete}
                        onClick={() => onDelete?.(postId)}
                      >
                        {isDeleting ? '삭제 중' : '삭제'}
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

export default DraftListModal
