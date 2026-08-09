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
    <div className="app-card mb-6 flex flex-wrap items-center gap-3 p-4 sm:gap-4 sm:p-5">
      <TechEnterpriseLogo enterprise={enterprise} className="size-14 p-2" />

      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold sm:text-2xl">
          {enterprise.name}
        </h1>
        <a
          className="text-xs font-medium text-app-text-muted underline-offset-4 transition-colors hover:text-app-primary hover:underline"
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
          className="app-btn app-btn-outline app-btn-sm w-[88px]"
          to="/tech-enterprises"
        >
          기업 목록
        </Link>
      </div>
    </div>
  )
}

export default TechEnterpriseHeader
