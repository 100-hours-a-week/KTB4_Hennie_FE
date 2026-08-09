import { Link } from 'react-router'
import SubscribeButton from './SubscribeButton'
import TechEnterpriseLogo from './TechEnterpriseLogo'

function TechEnterpriseHeader({
  enterprise,
  isSubscribed = false,
  isSubscriptionPending = false,
  subscriptionDisabled = false,
  onToggleSubscription,
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <TechEnterpriseLogo enterprise={enterprise} />

      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold">{enterprise.name}</h1>
        <a
          className="text-xs text-app-text-muted hover:text-app-primary"
          href={enterprise.href}
          target="_blank"
          rel="noreferrer"
        >
          기술 블로그 바로가기
        </a>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <SubscribeButton
          className="w-[88px]"
          enterpriseName={enterprise.name}
          isSubscribed={isSubscribed}
          isPending={isSubscriptionPending}
          disabled={subscriptionDisabled}
          onToggle={() => onToggleSubscription?.(enterprise.code)}
        />

        <Link
          className="inline-flex h-9 w-[88px] items-center justify-center rounded-md border border-app-border px-3 text-sm font-medium text-app-text-muted transition-[border-color,color] duration-150 hover:border-app-primary/50 hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
          to="/tech-enterprises"
        >
          기업 목록
        </Link>
      </div>
    </div>
  )
}

export default TechEnterpriseHeader
