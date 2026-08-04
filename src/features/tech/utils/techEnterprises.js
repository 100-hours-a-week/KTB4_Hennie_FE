export const TECH_ENTERPRISES = [
  {
    code: 'KAKAO',
    name: '카카오',
    initials: 'ka',
    href: 'https://tech.kakao.com',
  },
  {
    code: 'NAVER_D2',
    name: '네이버 D2',
    initials: 'na',
    href: 'https://d2.naver.com',
  },
  {
    code: 'TOSS',
    name: '토스',
    initials: 'to',
    href: 'https://toss.tech',
  },
  {
    code: 'WOOWA',
    name: '우아한형제들',
    initials: 'wo',
    href: 'https://techblog.woowahan.com',
  },
  {
    code: 'DAANGN',
    name: '당근',
    initials: 'da',
    href: 'https://medium.com/daangn',
  },
  {
    code: 'OLIVE_YOUNG',
    name: '올리브영',
    initials: 'ol',
    href: 'https://oliveyoung.tech',
  },
]

export const TECH_ENTERPRISE_SECTIONS = [
  {
    id: 'enterprises',
    title: '테크 기업',
    description: '기업 개발 부서가 운영하는 블로그',
    enterprises: TECH_ENTERPRISES,
  },
]

export const getTechEnterpriseName = (code) =>
  TECH_ENTERPRISES.find((enterprise) => enterprise.code === code)?.name ?? ''
