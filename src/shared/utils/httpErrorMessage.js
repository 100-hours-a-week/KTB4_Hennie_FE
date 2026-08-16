import { LOGIN_REQUIRED_MESSAGE } from './constants'
// HTTP 상태코드 → 사용자 메시지 공통 매퍼.
export const getHttpErrorMessage = (error, { forbidden, fallback }) => {
  if (error?.status === 401) {
    return LOGIN_REQUIRED_MESSAGE
  }

  if (error?.status === 403) {
    return forbidden
  }

  if (error?.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return fallback
}
