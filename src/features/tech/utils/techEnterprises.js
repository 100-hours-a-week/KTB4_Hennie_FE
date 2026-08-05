import { TECH_ENTERPRISES } from '../../../shared/utils/constants'

export const TECH_ENTERPRISE_SECTIONS = [
  {
    id: 'enterprises',
    title: '테크 기업',
    description: '기업 개발 부서가 운영하는 블로그',
    enterprises: TECH_ENTERPRISES,
  },
]

export const getTechEnterprise = (code) =>
  TECH_ENTERPRISES.find((enterprise) => enterprise.code === code) ?? null

export const getTechEnterpriseName = (code) =>
  getTechEnterprise(code)?.name ?? ''
