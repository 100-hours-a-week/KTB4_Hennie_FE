import { LOGIN_REQUIRED_MESSAGE } from './constants'

// HTTP 상태코드 → 사용자 메시지 공통 매퍼.
export const getHttpErrorMessage = (
  error,
  { network, unauthorized, forbidden, notFound, serverError, fallback } = {},
) => {
  if (error?.status === undefined) {
    return network ?? '네트워크 연결을 확인한 뒤 다시 시도해주세요.'
  }

  if (error?.status === 401) {
    return unauthorized ?? LOGIN_REQUIRED_MESSAGE
  }

  if (error?.status === 403 && forbidden !== undefined) {
    return forbidden
  }

  if (error?.status === 404 && notFound !== undefined) {
    return notFound
  }

  if (error?.status >= 500) {
    return serverError ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return fallback
}
