import { API_ERROR_CODE } from '../../../shared/utils/apiErrorCode'
const getSignupErrorMessage = (error) => {
  if (error?.code === API_ERROR_CODE.EMAIL_ALREADY_EXISTS) {
    return {
      field: 'email',
      message: '이미 사용중인 이메일입니다.',
    }
  }

  if (error?.code === API_ERROR_CODE.NICKNAME_ALREADY_EXISTS) {
    return {
      field: 'nickname',
      message: '이미 사용중인 닉네임입니다.',
    }
  }

  return {
    field: null,
    message: '회원가입에 실패했습니다.',
  }
}

export default getSignupErrorMessage
