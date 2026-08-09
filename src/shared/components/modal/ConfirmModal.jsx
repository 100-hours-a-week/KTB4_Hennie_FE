import { useEffect, useEffectEvent, useId, useRef } from 'react'

const BUTTON_BASE_CLASS = 'app-btn app-btn-md min-h-11 flex-1'

function ConfirmModal({
  isOpen,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel = '확인',
  pendingLabel = '처리 중...',
  isPending = false,
  closeOnBackdrop = true,
  initialFocusRef,
  onCancel,
  onConfirm,
  children,
}) {
  const generatedId = useId()
  const modalRef = useRef(null)
  const cancelButtonRef = useRef(null)
  const previousFocusRef = useRef(null)

  const titleId = `${generatedId}-title`
  const descriptionId = `${generatedId}-description`

  const cancelFromEffect = useEffectEvent(() => {
    if (isPending) {
      return false
    }

    onCancel?.()
    return true
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = requestAnimationFrame(() => {
      const initialFocusElement =
        initialFocusRef?.current ?? cancelButtonRef.current
      initialFocusElement?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (cancelFromEffect()) {
          event.preventDefault()
        }
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [isOpen, initialFocusRef])

  if (!isOpen) {
    return null
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && closeOnBackdrop && !isPending) {
      onCancel?.()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-app-bg-sunken/80 px-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="w-full max-w-sm rounded-2xl border border-app-border bg-app-surface p-6 text-center shadow-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={isPending}
      >
        <h2 className="mb-2 text-lg font-bold" id={titleId}>
          {title}
        </h2>

        {description && (
          <p
            className={`${children ? 'mb-4' : 'mb-7'} whitespace-pre-line text-sm leading-6 text-app-text-muted`}
            id={descriptionId}
          >
            {description}
          </p>
        )}

        {children && <div className="mb-6 text-left">{children}</div>}

        <div
          className={`flex gap-2.5 ${description || children ? '' : 'mt-6'}`}
        >
          <button
            className={`${BUTTON_BASE_CLASS} app-btn-outline`}
            ref={cancelButtonRef}
            type="button"
            disabled={isPending}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`${BUTTON_BASE_CLASS} app-btn-primary`}
            type="button"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
