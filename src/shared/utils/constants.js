export const APP_NAME = '개발바닥'
export const LOGO_PATH = '/assets/logo.webp'
export const DEFAULT_PROFILE_PATH = '/assets/profile-default.webp'
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const POST_LIST_SKELETON_COUNT = 4
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,20}$/
export const NICKNAME_MAX_LENGTH = 10
export const MAX_DRAFT_COUNT = 10
export const SENTINEL_ROOT_MARGIN = '180px 0px' // 미리 다음 페이지를 받는 화면 아래 남아있는 기준값
export const TITLE_MAX_LENGTH = 100
export const LIST_TITLE_MAX_LENGTH = 55
export const COMMENT_MAX_LENGTH = 3000
export const TECH_ENTERPRISES = [
  {
    code: 'KAKAO',
    slug: 'KAKAO',
    name: '카카오',
    logoUrl: '/assets/enterprise/enterprise_kakao.png',
    href: 'https://tech.kakao.com',
  },
  {
    code: 'NAVER_D2',
    slug: 'NAVERD2',
    name: '네이버 D2',
    logoUrl: '/assets/enterprise/enterprise_naver_d2.png',
    href: 'https://d2.naver.com',
  },
  {
    code: 'TOSS',
    slug: 'TOSS',
    name: '토스',
    logoUrl: '/assets/enterprise/enterprise_toss.png',
    href: 'https://toss.tech',
  },
  {
    code: 'WOOWA',
    slug: 'WOOWA',
    name: '우아한형제들',
    logoUrl: '/assets/enterprise/enterprise_woowa.png',
    href: 'https://techblog.woowahan.com',
  },
  {
    code: 'DAANGN',
    slug: 'DAANGN',
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
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
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
export const NOTIFICATION_PAGE_SIZE = 20
export const NOTIFICATION_TYPE_LABEL = {
  POST_COMMENT: '게시글 댓글',
  COMMENT_REPLY: '댓글 답글',
  REPLY_REPLY: '답글',
  SUBSCRIBED_ENTERPRISE_ARTICLE: '기업 기술 원문',
}
export const ABORT_ERROR_NAME = 'AbortError'
export const LOGIN_REQUIRED_MESSAGE = '로그인이 필요합니다.'
export const UNKNOWN_AUTHOR_NAME = '알 수 없음'
export const UNTITLED_TITLE = '제목 없음'
export const POST_LIST_LABEL = '게시글'
export const TECH_ARTICLE_LIST_LABEL = '기술 원문'
export const POST_NOT_FOUND_MESSAGE = '게시글을 찾을 수 없습니다.'
export const POST_LOAD_FAILED_MESSAGE = '게시글을 불러오지 못했습니다.'
export const TITLE_CONTENT_REQUIRED_MESSAGE = '제목,내용을 모두 작성해주세요'
export const CATEGORY_REQUIRED_MESSAGE = '유형을 선택해주세요'
export const COMMENT_REQUIRED_MESSAGE = '댓글 내용을 입력해주세요.'
