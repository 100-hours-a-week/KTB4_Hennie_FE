import { withObjectParticle, withSubjectParticle } from './koreanParticle'

// 무한 스크롤 목록 하단에 노출되는 안내 문구(로딩 > 에러 > 마지막 페이지 순)
export const getListStatusMessage = ({
  label,
  currentPage,
  error,
  hasNextPage,
  isLoading,
}) => {
  if (isLoading) {
    return `${withObjectParticle(label)} 불러오는 중입니다.`
  }

  if (error) {
    return error
  }

  if (!hasNextPage && currentPage > 1) {
    return `더 불러올 ${withSubjectParticle(label)} 없습니다.`
  }

  return ''
}
