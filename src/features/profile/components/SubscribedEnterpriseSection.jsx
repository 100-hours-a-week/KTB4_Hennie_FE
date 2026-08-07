import { Link } from 'react-router'
import { useEnterpriseSubscription } from '../../tech/hook/useEnterpriseSubscription'
import { TECH_ENTERPRISES } from '../../../shared/utils/constants'
import TechEnterpriseCard from '../../tech/components/TechEnterpriseCard'

function SubscribedEnterpriseSection() {
  const { subscribedCodes, subscribedCount, isSubscribed, toggleSubscription } =
    useEnterpriseSubscription()
  const subscribedEnterprises = TECH_ENTERPRISES.filter((enterprise) =>
    subscribedCodes.has(enterprise.code),
  )

  return (
    <section
      className="scroll-mt-28 rounded-xl border border-app-border bg-app-surface p-5 sm:p-6"
      id="subscriptions"
      aria-labelledby="subscription-settings-title"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-app-border pb-4">
        <div>
          <h2 className="text-lg font-bold" id="subscription-settings-title">
            구독한 기업
          </h2>
          <p className="mt-1 text-sm text-app-text-muted">
            새 기술 원문 알림을 받을 기업을 관리합니다.
          </p>
        </div>
        <span className="rounded-full bg-app-surface-raised px-3 py-1 text-xs font-medium text-app-primary">
          {subscribedCount}곳 구독 중
        </span>
      </div>

      {subscribedEnterprises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-app-border px-4 py-10 text-center">
          <p className="text-sm text-app-text-muted">
            아직 구독한 기업이 없습니다.
          </p>
          <Link
            className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-app-primary px-4 text-sm font-medium text-white hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            to="/tech-enterprises"
          >
            기업 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {subscribedEnterprises.map((enterprise) => (
            <TechEnterpriseCard
              enterprise={enterprise}
              isSubscribed={isSubscribed(enterprise.code)}
              key={enterprise.code}
              onToggle={toggleSubscription}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SubscribedEnterpriseSection
