import { useRef } from 'react'
import { Navigate, useParams } from 'react-router'
import TechArticleList from '../../features/tech/components/TechArticleList'
import TechEnterpriseHeader from '../../features/tech/components/TechEnterpriseHeader'
import { useEnterpriseSubscription } from '../../features/tech/hook/useEnterpriseSubscription'
import { useTechArticleList } from '../../features/tech/hook/useTechArticleList'
import NotFoundPage from '../../shared/components/NotFoundPage'
import { useInfiniteScroll } from '../../shared/hook/useInfiniteScroll'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import { getListStatusMessage } from '../../shared/utils/listStatusMessage'
import { TECH_ARTICLE_LIST_LABEL } from '../../shared/utils/constants'

function TechArticleListPage() {
  const { enterpriseSlug } = useParams()
  const {
    getEnterpriseByCode,
    getEnterpriseBySlug,
    isSubscribed,
    isSubscriptionPending,
    toggleSubscription,
  } = useEnterpriseSubscription()
  const enterprise =
    getEnterpriseBySlug(enterpriseSlug) ?? getEnterpriseByCode(enterpriseSlug)
  const shouldRedirectToCanonicalSlug =
    enterprise != null && enterpriseSlug !== enterprise.slug

  usePageTitle(enterprise ? `${enterprise.name} 기술 원문` : '기술 원문')

  const sentinelRef = useRef(null)
  const { articles, currentPage, error, hasNextPage, isLoading, loadNextPage } =
    useTechArticleList(shouldRedirectToCanonicalSlug ? null : enterprise?.code)

  useInfiniteScroll({
    targetRef: sentinelRef,
    enabled: !isLoading && !error && hasNextPage && currentPage >= 1,
    onIntersect: loadNextPage,
  })

  if (shouldRedirectToCanonicalSlug) {
    return <Navigate to={`/tech-enterprises/${enterprise.slug}`} replace />
  }

  if (!enterprise) {
    return (
      <NotFoundPage
        title="기업을 찾을 수 없습니다"
        description="지원하지 않는 기업입니다."
        to="/tech-enterprises"
        linkLabel="기업 목록으로 돌아가기"
      />
    )
  }

  const statusMessage = getListStatusMessage({
    label: TECH_ARTICLE_LIST_LABEL,
    currentPage,
    error,
    hasNextPage,
    isLoading,
  })

  return (
    <section className="mx-auto max-w-[840px] px-4 pt-5 pb-20 sm:px-6 sm:pt-6">
      <TechEnterpriseHeader
        enterprise={enterprise}
        isSubscribed={isSubscribed(enterprise.code)}
        isSubscriptionPending={isSubscriptionPending(enterprise.code)}
        subscriptionDisabled={
          enterprise.id == null ||
          (!isSubscribed(enterprise.code) && enterprise.isActive !== true)
        }
        onToggleSubscription={toggleSubscription}
      />

      <TechArticleList articles={articles} />

      <div className="app-list-status" ref={sentinelRef} aria-live="polite">
        {statusMessage}
      </div>
    </section>
  )
}

export default TechArticleListPage
