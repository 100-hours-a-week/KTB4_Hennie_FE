import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { API_ERROR_CODE } from '../../../shared/utils/apiErrorCode'

const ENTERPRISE_NOT_FOUND_MESSAGE =
  '기업 정보를 찾을 수 없습니다. 목록을 새로고침해주세요.'
const SUBSCRIPTION_SERVER_ERROR_MESSAGE =
  '구독 정보를 처리하는 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.'

export const getEnterpriseSubscriptionErrorMessage = (error, fallback) => {
  // 401은 도메인 코드보다 먼저 본다
  if (error?.status === 401) {
    return getHttpErrorMessage(error)
  }

  if (error?.code === API_ERROR_CODE.ENTERPRISE_INACTIVE) {
    return '현재 구독할 수 없는 기업입니다.'
  }

  if (error?.code === API_ERROR_CODE.ENTERPRISE_NOT_FOUND) {
    return ENTERPRISE_NOT_FOUND_MESSAGE
  }

  return getHttpErrorMessage(error, {
    // 구독 기능은 기존대로 네트워크 오류도 호출부 문구로 안내한다
    network: fallback,
    notFound: ENTERPRISE_NOT_FOUND_MESSAGE,
    serverError: SUBSCRIPTION_SERVER_ERROR_MESSAGE,
    fallback,
  })
}
