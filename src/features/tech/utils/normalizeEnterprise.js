import { TECH_ENTERPRISES } from '../../../shared/utils/constants'

const getEnterpriseMetadata = (code) =>
  TECH_ENTERPRISES.find((enterprise) => enterprise.code === code) ?? {}

export const createFallbackEnterpriseList = () =>
  TECH_ENTERPRISES.map((enterprise) => ({
    ...enterprise,
    id: null,
    isActive: null,
  }))

export const normalizeEnterprise = (enterprise = {}) => {
  const code = enterprise.crawlSource || enterprise.code || ''
  const metadata = getEnterpriseMetadata(code)

  if (!metadata.code) {
    return null
  }

  return {
    ...metadata,
    id: enterprise.enterpriseId ?? enterprise.id ?? null,
    code,
    name: enterprise.name || metadata.name || code,
    isActive: Boolean(enterprise.status),
  }
}

export const normalizeEnterpriseList = (data) =>
  (Array.isArray(data) ? data : [])
    .map(normalizeEnterprise)
    .filter((enterprise) => enterprise?.id != null && enterprise.code)
