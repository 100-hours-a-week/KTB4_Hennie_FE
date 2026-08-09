import { useId } from 'react'
import { COMMENT_MAX_LENGTH } from '../../../shared/utils/constants'

function CommentForm({
  value,
  onChange,
  onSubmit,
  inputRef,
  inputId,
  name = 'comment',
  label,
  placeholder,
  className = '',
  autoFocus = false,
  isPending = false,
  submitDisabled = false,
  submitLabel = '댓글 등록',
  pendingLabel = '등록 중...',
  cancelLabel = '취소',
  onCancel,
}) {
  const generatedId = useId()
  const resolvedInputId = inputId || `${generatedId}-comment`

  return (
    <form
      className={`${className} rounded-2xl border border-app-border bg-app-bg-sunken p-3.5 transition-colors duration-150 focus-within:border-app-primary/45`}
      onSubmit={onSubmit}
    >
      {label && (
        <label
          className="mb-2 block text-xs font-semibold text-app-text-muted"
          htmlFor={resolvedInputId}
        >
          {label}
        </label>
      )}
      <textarea
        className="min-h-[76px] w-full resize-y bg-transparent text-sm leading-[1.7] text-app-text placeholder:text-app-text-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        ref={inputRef}
        id={resolvedInputId}
        name={name}
        placeholder={placeholder}
        maxLength={COMMENT_MAX_LENGTH}
        autoFocus={autoFocus}
        disabled={isPending}
        value={value}
        onChange={onChange}
      />
      <div className="mt-2.5 flex justify-end gap-2 border-t border-app-border pt-2.5">
        {onCancel && (
          <button
            className="app-btn app-btn-outline app-btn-xs"
            type="button"
            disabled={isPending}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        )}
        <button
          className="app-btn app-btn-primary app-btn-xs"
          type="submit"
          disabled={isPending || submitDisabled}
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
