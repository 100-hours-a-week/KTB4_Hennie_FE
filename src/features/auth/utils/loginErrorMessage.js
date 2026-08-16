import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { API_ERROR_CODE } from '../../../shared/utils/apiErrorCode'

const LOGIN_FALLBACK_MESSAGE =
  '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'

// 로그인 실패 메시지 매핑 (useLogin 전용)
const getLoginErrorMessage = (error) => {
  // 로그인 화면의 401은 세션 만료가 아니라 자격 증명 오류
  if (
    error?.status === 400 ||
    error?.status === 401 ||
    error?.code === API_ERROR_CODE.INVALID_CREDENTIALS
  ) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }

  return getHttpErrorMessage(error, {
    network: LOGIN_FALLBACK_MESSAGE,
    fallback: LOGIN_FALLBACK_MESSAGE,
  })
}

export default getLoginErrorMessage
