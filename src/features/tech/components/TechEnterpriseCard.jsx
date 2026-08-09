import { Link } from 'react-router'
import SubscribeButton from './SubscribeButton'
import TechEnterpriseLogo from './TechEnterpriseLogo'

function TechEnterpriseCard({
  enterprise,
  isSubscribed = false,
  isSubscriptionPending = false,
  subscriptionDisabled = false,
  onToggle,
}) {
  return (
    <div className="relative">
      <Link
        className="group flex flex-col items-center gap-3 rounded-md border border-app-border bg-app-surface px-4 py-6 transition-colors duration-100 hover:border-app-border-strong hover:bg-app-surface-raised"
        to={`/tech-enterprises/${enterprise.slug}`}
      >
        <TechEnterpriseLogo enterprise={enterprise} className="size-12 p-1.5" />
        <span className="max-w-full truncate text-center text-sm font-medium text-app-text">
          {enterprise.name}
        </span>
      </Link>

      <SubscribeButton
        className="absolute top-2 right-2 z-10"
        enterpriseName={enterprise.name}
        isSubscribed={isSubscribed}
        isPending={isSubscriptionPending}
        disabled={subscriptionDisabled}
        compact
        onToggle={() => onToggle?.(enterprise.code)}
      />
    </div>
  )
}

export default TechEnterpriseCard
