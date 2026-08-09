export const getEnterpriseSubscriptionErrorMessage = (error, fallback) => {
  if (error?.status === 401) {
    return '로그인이 필요합니다.'
  }

  if (error?.code === 'ENTERPRISE_INACTIVE') {
    return '현재 구독할 수 없는 기업입니다.'
  }

  if (error?.code === 'ENTERPRISE_NOT_FOUND' || error?.status === 404) {
    return '기업 정보를 찾을 수 없습니다. 목록을 새로고침해주세요.'
  }

  if (error?.status >= 500) {
    return '구독 정보를 처리하는 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.'
  }

  return fallback
}
