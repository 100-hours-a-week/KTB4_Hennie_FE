import TechEnterpriseSection from '../../features/tech/components/TechEnterpriseSection'
import { useEnterpriseSubscription } from '../../features/tech/hook/useEnterpriseSubscription'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function TechEnterprisePage() {
  usePageTitle('기술 원문')

  const {
    enterprises,
    enterpriseError,
    isLoadingEnterprises,
    isSubscribed,
    isSubscriptionPending,
    refreshEnterprises,
    toggleSubscription,
  } = useEnterpriseSubscription()
  const section = {
    id: 'enterprises',
    title: '테크 기업',
    description: '기업 개발 부서가 운영하는 블로그',
    enterprises,
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6 pb-20 sm:px-6 sm:pt-8">
      <div>
        <p className="app-page-intro">
          기업 <strong className="font-bold text-app-primary">개발</strong>{' '}
          부서가 남긴 기술{' '}
          <strong className="font-bold text-app-primary">발자국</strong>을 따라
          <br />
          <strong className="font-bold text-app-text">원문</strong>을
          읽어보세요...🐾
        </p>
      </div>

      {enterpriseError && (
        <div className="app-alert-error mb-6" role="alert">
          <p className="text-sm text-app-error">{enterpriseError}</p>
          <button
            className="app-btn app-btn-outline app-btn-xs"
            type="button"
            onClick={refreshEnterprises}
          >
            다시 시도
          </button>
        </div>
      )}

      <TechEnterpriseSection
        section={section}
        isSubscribed={isSubscribed}
        isSubscriptionPending={isSubscriptionPending}
        onToggleSubscription={toggleSubscription}
      />

      {isLoadingEnterprises && (
        <p className="app-list-status mt-5" role="status" aria-live="polite">
          기업 정보를 불러오는 중입니다.
        </p>
      )}
    </div>
  )
}

export default TechEnterprisePage
