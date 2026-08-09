export const normalizeEnterpriseSubscription = (subscription = {}) => ({
  enterpriseId: subscription.enterpriseId ?? null,
  isActive: Boolean(subscription.status),
})

export const normalizeEnterpriseSubscriptionList = (data = {}) =>
  (Array.isArray(data.subscriptions) ? data.subscriptions : [])
    .map(normalizeEnterpriseSubscription)
    .filter(({ enterpriseId }) => enterpriseId != null)
