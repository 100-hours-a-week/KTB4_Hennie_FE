import { Link } from 'react-router'
import { useEnterpriseSubscription } from '../../tech/hook/useEnterpriseSubscription'
import TechEnterpriseCard from '../../tech/components/TechEnterpriseCard'

function SubscribedEnterpriseSection() {
  const {
    isLoadingSubscriptions,
    isSubscribed,
    isSubscriptionPending,
    refreshSubscriptions,
    subscribedCount,
    subscribedEnterprises,
    subscriptionError,
    toggleSubscription,
  } = useEnterpriseSubscription()

  return (
    <section
      className="scroll-mt-24"
      id="subscriptions"
      aria-labelledby="subscription-settings-title"
    >
      <div className="app-section-header flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="app-section-title" id="subscription-settings-title">
            구독한 기업
          </h2>
          <p className="app-section-description">
            새 기술 원문 알림을 받을 기업을 관리합니다.
          </p>
        </div>
        <span className="app-chip-neutral">{subscribedCount}곳 구독 중</span>
      </div>

      {subscriptionError && (
        <div className="app-alert-error mb-5" role="alert">
          <p className="text-sm text-app-error">{subscriptionError}</p>
          <button
            className="app-btn app-btn-outline app-btn-xs"
            type="button"
            onClick={refreshSubscriptions}
          >
            다시 시도
          </button>
        </div>
      )}

      {isLoadingSubscriptions && subscribedEnterprises.length === 0 ? (
        <p className="app-empty" role="status" aria-live="polite">
          구독한 기업을 불러오는 중입니다.
        </p>
      ) : subscribedEnterprises.length === 0 ? (
        <div className="app-empty">
          <p className="text-sm text-app-text-muted">
            아직 구독한 기업이 없습니다.
          </p>
          <Link
            className="app-btn app-btn-outline app-btn-sm mt-4"
            to="/tech-enterprises"
          >
            기업 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subscribedEnterprises.map((enterprise) => (
            <TechEnterpriseCard
              enterprise={enterprise}
              isSubscribed={isSubscribed(enterprise.code)}
              isSubscriptionPending={isSubscriptionPending(enterprise.code)}
              key={enterprise.code}
              onToggle={toggleSubscription}
              subscriptionDisabled={
                enterprise.id == null ||
                (!isSubscribed(enterprise.code) && enterprise.isActive !== true)
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SubscribedEnterpriseSection
