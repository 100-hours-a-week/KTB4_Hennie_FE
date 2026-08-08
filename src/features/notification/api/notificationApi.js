import { get, patch } from '../../../shared/api/http'
import {
  normalizeNotificationList,
  normalizeUnreadCount,
} from '../utils/normalizeNotification'
import { NOTIFICATION_PAGE_SIZE } from '../../../shared/utils/constants'

export const getNotificationList = async (
  { page = 1, size = NOTIFICATION_PAGE_SIZE } = {},
  options = {},
) => {
  const response = await get('/notifications', {
    ...options,
    auth: true,
    params: { page, size },
  })

  return normalizeNotificationList(response?.data)
}

export const getUnreadNotificationCount = async (options = {}) => {
  const response = await get('/notifications/unread-count', {
    ...options,
    auth: true,
  })

  return normalizeUnreadCount(response?.data)
}

export const markNotificationAsRead = (notificationId, options = {}) =>
  patch(`/notifications/${notificationId}/read`, undefined, {
    ...options,
    auth: true,
  })

export const markAllNotificationsAsRead = (options = {}) =>
  patch('/notifications/read-all', undefined, {
    ...options,
    auth: true,
  })
