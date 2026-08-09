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
    <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-app-border pb-4">
      <TechEnterpriseLogo enterprise={enterprise} className="size-9 p-1.5" />

      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold sm:text-xl">
          {enterprise.name}
        </h1>
        <a
          className="text-xs text-app-text-subtle underline-offset-4 transition-colors hover:text-app-text hover:underline"
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
          className="app-btn app-btn-ghost app-btn-sm"
          to="/tech-enterprises"
        >
          기업 목록
        </Link>
      </div>
    </div>
  )
}

export default TechEnterpriseHeader
