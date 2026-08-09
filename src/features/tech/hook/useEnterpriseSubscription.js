import { useEnterpriseCatalog } from './useEnterpriseCatalog'
import { useEnterpriseSubscriptions } from './useEnterpriseSubscriptions'

export const useEnterpriseSubscription = () => {
  const catalog = useEnterpriseCatalog()
  const subscriptions = useEnterpriseSubscriptions(catalog)

  return {
    ...catalog,
    ...subscriptions,
  }
}
