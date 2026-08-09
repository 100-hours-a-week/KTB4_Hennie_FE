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
        className="app-card app-card-interactive group flex flex-col items-center gap-3.5 px-4 py-7 hover:border-app-primary/45"
        to={`/tech-enterprises/${enterprise.slug}`}
      >
        <TechEnterpriseLogo
          enterprise={enterprise}
          className="size-14 p-2 transition-transform duration-200 group-hover:scale-105"
        />
        <span className="text-center text-sm font-semibold text-app-text-muted transition-colors duration-200 group-hover:text-app-text">
          {enterprise.name}
        </span>
      </Link>

      <SubscribeButton
        className="absolute top-2.5 right-2.5 z-10"
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
