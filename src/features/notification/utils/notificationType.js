import { NOTIFICATION_TYPE_LABEL } from '../../../shared/utils/constants'

export const getNotificationTypeLabel = (type) =>
  NOTIFICATION_TYPE_LABEL[type] || '알림'
