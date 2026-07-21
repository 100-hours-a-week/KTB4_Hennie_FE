import { useId } from 'react'

const INPUT_BASE_CLASS =
  'peer h-11 w-full rounded-sm border border-[#3a3e44] bg-app-surface px-3 text-sm text-app-text placeholder:text-[#6b7178] focus:border-app-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-app-surface-raised disabled:text-app-text-muted read-only:cursor-not-allowed read-only:bg-app-surface-raised read-only:text-app-text-muted'

const FLOATING_INPUT_CLASS = 'h-[54px] rounded-md bg-[#1b1d20] pt-[18px] pb-0'

const FLOATING_LABEL_CLASS =
  'pointer-events-none absolute top-[9px] left-[13px] text-xs text-app-text-muted transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#6b7178] peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-app-primary'

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(' ')

function FormField({
  id: providedId,
  label,
  error,
  helperText,
  floating = false,
  reserveMessageSpace = false,
  className,
  inputClassName,
  messageClassName,
  endAdornment,
  type = 'text',
  placeholder,
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = providedId || generatedId
  const messageId = `${inputId}-message`
  const message = error || helperText
  const hasMessageArea = Boolean(message) || reserveMessageSpace
  const describedBy = [
    inputProps['aria-describedby'],
    hasMessageArea && messageId,
  ]
    .filter(Boolean)
    .join(' ')

  const input = (
    <input
      {...inputProps}
      className={joinClassNames(
        INPUT_BASE_CLASS,
        floating && FLOATING_INPUT_CLASS,
        endAdornment && 'pr-16',
        error && 'border-app-error',
        inputClassName,
      )}
      id={inputId}
      type={type}
      placeholder={floating ? ' ' : placeholder}
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : inputProps['aria-invalid']}
    />
  )

  return (
    <div className={joinClassNames('flex flex-col gap-2', className)}>
      {!floating && (
        <label className="text-sm font-medium" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="relative">
        {input}

        {floating && (
          <label className={FLOATING_LABEL_CLASS} htmlFor={inputId}>
            {label}
          </label>
        )}

        {endAdornment && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>

      {hasMessageArea && (
        <p
          className={joinClassNames(
            'min-h-4 whitespace-pre-line text-xs leading-[1.4]',
            error ? 'text-app-error' : 'text-app-text-muted',
            messageClassName,
          )}
          id={messageId}
          aria-live={error ? 'polite' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export default FormField
