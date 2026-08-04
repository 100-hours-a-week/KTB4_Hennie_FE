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
      className={`${className} rounded-lg border border-[#3a3e44] bg-app-bg p-3`}
      onSubmit={onSubmit}
    >
      {label && (
        <label
          className="mb-2 block text-xs font-medium text-app-text-muted"
          htmlFor={resolvedInputId}
        >
          {label}
        </label>
      )}
      <textarea
        className="min-h-[72px] w-full resize-y bg-transparent text-sm leading-[1.6] text-app-text placeholder:text-[#6b7178] focus:outline-none"
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
      <div className="mt-2 flex justify-end gap-2">
        {onCancel && (
          <button
            className="inline-flex h-8 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-3 text-xs font-medium text-app-text-muted transition-colors hover:bg-app-surface-raised hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={isPending}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        )}
        <button
          className="inline-flex h-8 items-center justify-center rounded-md bg-app-primary px-3 text-xs font-medium text-white transition-colors hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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
