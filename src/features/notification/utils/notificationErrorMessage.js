export const getNotificationErrorMessage = (error, fallback) => {
  if (error?.status === 401) {
    return '로그인 정보가 만료됐어요. 다시 로그인해주세요.'
  }

  if (error?.status === 403) {
    return '이 알림을 확인할 수 없어요.'
  }

  if (error?.status === 404) {
    return '알림을 찾을 수 없어요. 목록을 새로고침해주세요.'
  }

  if (error?.status >= 500) {
    return '알림을 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.'
  }

  return fallback
}
