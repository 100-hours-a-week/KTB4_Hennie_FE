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
    <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-24">
      <div className="mb-10">
        <p className="mb-6 text-center text-base leading-[1.6]">
          기업 <strong className="font-bold">개발</strong> 부서가 남긴 기술{' '}
          <strong className="font-bold">발자국</strong>을 따라
          <br />
          <strong className="font-bold">원문</strong>을 읽어보세요...🐾
        </p>
      </div>

      {enterpriseError && (
        <div
          className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-app-error/40 bg-app-error/10 px-4 py-3"
          role="alert"
        >
          <p className="text-sm text-app-error">{enterpriseError}</p>
          <button
            className="shrink-0 text-xs font-medium text-app-text underline hover:text-white"
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
        <p
          className="mt-5 text-center text-xs text-app-text-muted"
          role="status"
          aria-live="polite"
        >
          기업 정보를 불러오는 중입니다.
        </p>
      )}
    </div>
  )
}

export default TechEnterprisePage
