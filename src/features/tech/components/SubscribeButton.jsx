import { BellIcon, CheckIcon } from '../../../shared/components/IconsList'

const BASE_CLASS = 'app-btn disabled:opacity-50'

const SUBSCRIBED_CLASS =
  'border border-app-border-strong bg-app-surface text-app-text-muted hover:border-app-text-subtle hover:text-app-text'

const UNSUBSCRIBED_CLASS =
  'border border-app-primary/40 bg-app-primary/10 font-semibold text-app-primary hover:border-app-primary/70 hover:bg-app-primary/18'

const SIZE_CLASS = {
  default: 'app-btn-sm',
  compact: 'size-7 text-xs',
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
