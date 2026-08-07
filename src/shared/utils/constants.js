export const APP_NAME = '개발바닥'
export const LOGO_PATH = '/assets/logo.png'
export const DEFAULT_PROFILE_PATH = '/assets/profile-default.jpeg'
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,20}$/
export const NICKNAME_MAX_LENGTH = 10
export const MAX_DRAFT_COUNT = 10
export const TITLE_MAX_LENGTH = 100
export const LIST_TITLE_MAX_LENGTH = 55
export const COMMENT_MAX_LENGTH = 3000
export const TECH_ENTERPRISES = [
  {
    code: 'KAKAO',
    name: '카카오',
    logoUrl: '/assets/enterprise/enterprise_kakao.png',
    href: 'https://tech.kakao.com',
  },
  {
    code: 'NAVER_D2',
    name: '네이버 D2',
    logoUrl: '/assets/enterprise/enterprise_naver_d2.png',
    href: 'https://d2.naver.com',
  },
  {
    code: 'TOSS',
    name: '토스',
    logoUrl: '/assets/enterprise/enterprise_toss.png',
    href: 'https://toss.tech',
  },
  {
    code: 'WOOWA',
    name: '우아한형제들',
    logoUrl: '/assets/enterprise/enterprise_woowa.png',
    href: 'https://techblog.woowahan.com',
  },
  {
    code: 'DAANGN',
    name: '당근',
    logoUrl: '/assets/enterprise/enterprise_daangn.png',
    href: 'https://medium.com/daangn',
  },
  {
    code: 'OLIVE_YOUNG',
    slug: 'OLIVEYOUNG',
    name: '올리브영',
    logoUrl: '/assets/enterprise/enterprise_olive_young.png',
    href: 'https://oliveyoung.tech',
  },
]
export const IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
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
