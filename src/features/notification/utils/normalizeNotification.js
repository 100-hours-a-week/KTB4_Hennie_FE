import { toCount } from '../../../shared/utils/countValue'

export const normalizeNotification = (notification = {}) => ({
  id: notification.notificationId ?? null,
  type: notification.notificationType || '',
  message: notification.message || '새로운 알림이 도착했습니다.',
  actorId: notification.actorId ?? null,
  postId: notification.postId ?? null,
  commentId: notification.commentId ?? null,
  articleId: notification.articleId ?? null,
  enterpriseId: notification.enterpriseId ?? null,
  readAt: notification.readAt || null,
  createdAt: notification.createdAt || '',
})

export const normalizeNotificationList = (data = {}) => ({
  notifications: (Array.isArray(data.notifications)
    ? data.notifications
    : []
  ).map(normalizeNotification),
  pagination: {
    page: toCount(data.page) || 1,
    size: toCount(data.size) || 20,
    totalCount: toCount(data.totalCount),
    totalPages: toCount(data.totalPages) || 1,
    hasNext: Boolean(data.hasNext),
  },
})

export const normalizeUnreadCount = (data = {}) => toCount(data.unreadCount)
