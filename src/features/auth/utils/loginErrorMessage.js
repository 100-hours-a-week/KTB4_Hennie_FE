// 로그인 실패 메시지 매핑 (useLogin 전용)
const getLoginErrorMessage = (error) => {
  if (
    error?.status === 400 ||
    error?.status === 401 ||
    error?.code === 'INVALID_CREDENTIALS'
  ) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }

  if (error?.status >= 500 && error?.status < 600) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
}

export default getLoginErrorMessage
