import { useId } from 'react'

const INPUT_BASE_CLASS = 'peer app-input'

const FLOATING_INPUT_CLASS = 'h-14 pt-5 pb-1'

const FLOATING_LABEL_CLASS =
  'pointer-events-none absolute top-2 left-3.5 text-[11px] font-semibold text-app-text-muted transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-app-text-subtle peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-app-primary'

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
        endAdornment && 'pr-14',
        error && 'app-input-invalid',
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
    <div className={joinClassNames('flex flex-col gap-1.5', className)}>
      {!floating && (
        <label className="app-field-label" htmlFor={inputId}>
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
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>

      {hasMessageArea && (
        <p
          className={joinClassNames(
            'min-h-4 whitespace-pre-line px-0.5 text-xs leading-[1.5]',
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
