import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import TechArticleList from '../../features/tech/components/TechArticleList'
import TechEnterpriseHeader from '../../features/tech/components/TechEnterpriseHeader'
import { useEnterpriseSubscription } from '../../features/tech/hook/useEnterpriseSubscription'
import { useTechArticleList } from '../../features/tech/hook/useTechArticleList'
import { getTechEnterprise } from '../../features/tech/utils/techEnterprises'
import NotFoundPage from '../../shared/components/NotFoundPage'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import { getListStatusMessage } from '../../shared/utils/listStatusMessage'

function TechArticleListPage() {
  const { enterprise: enterpriseCode } = useParams()
  const enterprise = getTechEnterprise(enterpriseCode)

  usePageTitle(enterprise ? `${enterprise.name} 기술 원문` : '기술 원문')

  const sentinelRef = useRef(null)
  const { articles, currentPage, error, hasNextPage, isLoading, loadNextPage } =
    useTechArticleList(enterprise?.code)
  const { isSubscribed, toggleSubscription } = useEnterpriseSubscription()

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || isLoading || error || !hasNextPage || currentPage < 1) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        observer.disconnect()
        loadNextPage()
      },
      {
        rootMargin: '180px 0px',
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [currentPage, error, hasNextPage, isLoading, loadNextPage])

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
    label: '기술 원문',
    currentPage,
    error,
    hasNextPage,
    isLoading,
  })

  return (
    <section className="mx-auto max-w-[720px] px-6 pt-8 pb-24">
      <TechEnterpriseHeader
        enterprise={enterprise}
        isSubscribed={isSubscribed(enterprise.code)}
        onToggleSubscription={toggleSubscription}
      />

      <TechArticleList articles={articles} />

      <div
        className="min-h-10 py-5 text-center text-xs text-app-text-muted"
        ref={sentinelRef}
        aria-live="polite"
      >
        {statusMessage}
      </div>
    </section>
  )
}

export default TechArticleListPage
