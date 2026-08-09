import { del, get, put } from '../../../shared/api/http'
import { normalizeEnterpriseList } from '../utils/normalizeEnterprise'
import { normalizeEnterpriseSubscriptionList } from '../utils/normalizeEnterpriseSubscription'

export const getEnterpriseList = async (options = {}) => {
  const response = await get('/enterprises', {
    ...options,
    auth: false,
  })

  return normalizeEnterpriseList(response?.data)
}

export const getEnterpriseSubscriptionList = async (options = {}) => {
  const response = await get('/enterprise-subscriptions', options)

  return normalizeEnterpriseSubscriptionList(response?.data)
}

export const subscribeEnterprise = (enterpriseId, options = {}) =>
  put(`/enterprise-subscriptions/${enterpriseId}`, undefined, options)

export const unsubscribeEnterprise = (enterpriseId, options = {}) =>
  del(`/enterprise-subscriptions/${enterpriseId}`, options)
