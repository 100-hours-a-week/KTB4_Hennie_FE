import { BellIcon, CheckIcon } from '../../../shared/components/IconsList'

const BASE_CLASS =
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-medium transition-[background-color,border-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-50'

const SUBSCRIBED_CLASS =
  'border border-app-border bg-app-surface text-app-text-muted hover:border-app-primary/50 hover:text-app-text'

const UNSUBSCRIBED_CLASS =
  'border border-transparent bg-app-primary text-white hover:bg-app-primary-hover'

const SIZE_CLASS = {
  default: 'h-9 px-3 text-sm',
  compact: 'size-8 text-xs',
}

function SubscribeButton({
  enterpriseName,
  isSubscribed = false,
  isPending = false,
  disabled = false,
  compact = false,
  className = '',
  onToggle,
}) {
  const size = compact ? SIZE_CLASS.compact : SIZE_CLASS.default
  const state = isSubscribed ? SUBSCRIBED_CLASS : UNSUBSCRIBED_CLASS

  return (
    <button
      className={`${BASE_CLASS} ${size} ${state} ${className}`}
      type="button"
      aria-label={`${enterpriseName} ${isSubscribed ? '구독 취소' : '구독'}`}
      aria-pressed={isSubscribed}
      disabled={disabled || isPending}
      onClick={onToggle}
    >
      {isSubscribed ? (
        <CheckIcon className="size-4" />
      ) : (
        <BellIcon className="size-4" />
      )}
      {!compact && (
        <span>{isPending ? '처리 중' : isSubscribed ? '구독중' : '구독'}</span>
      )}
    </button>
  )
}

export default SubscribeButton
