export const APP_NAME = '개발바닥'
export const LOGO_PATH = '/assets/logo.png'
export const DEFAULT_PROFILE_PATH = '/assets/profile-default.jpeg'
export const DEFAULT_POST_PAGE_SIZE = 10
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,20}$/
export const NICKNAME_MAX_LENGTH = 10
export const SIGNUP_EMPTY_ERRORS = {
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  }
export const PWD_EMPTY_ERRORS = {
    currentPassword: '',
    newPassword: '',
    passwordConfirm: '',
  }