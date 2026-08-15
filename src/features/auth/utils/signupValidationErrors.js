import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  NICKNAME_MAX_LENGTH,
  SIGNUP_EMPTY_ERRORS,
} from '../../../shared/utils/constants'

const getSignupValidationErrors = ({
  email,
  password,
  passwordConfirm,
  nickname,
}) => {
  const validationErrors = { ...SIGNUP_EMPTY_ERRORS }

  if (!email) {
    validationErrors.email = '이메일을 입력해주세요.'
  } else if (!EMAIL_PATTERN.test(email)) {
    validationErrors.email = '이메일 형식이 올바르지 않습니다.'
  }

  if (!password.trim()) {
    validationErrors.password = '비밀번호를 입력해주세요.'
  } else if (!PASSWORD_PATTERN.test(password)) {
    validationErrors.password = '비밀번호 형식이 올바르지 않습니다.'
  }

  if (!passwordConfirm.trim()) {
    validationErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
  } else if (password !== passwordConfirm) {
    validationErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
  } else if (!PASSWORD_PATTERN.test(password)) {
    validationErrors.password = '비밀번호 형식이 올바르지 않습니다.'
  }

  if (!nickname) {
    validationErrors.nickname = '닉네임을 입력해주세요.'
  } else if (nickname.length > NICKNAME_MAX_LENGTH) {
    validationErrors.nickname = '닉네임은 10자 이하로 입력해주세요.'
  } else if (/\s/.test(nickname)) {
    validationErrors.nickname = '닉네임에는 공백을 사용할 수 없습니다.'
  }

  return validationErrors
}

export default getSignupValidationErrors
