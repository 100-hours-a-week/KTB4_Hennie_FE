import { Link } from 'react-router'
import { formatDate } from '../../../shared/utils/formatDate'
import { getNotificationTypeLabel } from '../utils/notificationType'

const ENTERPRISE_ARTICLE_NOTIFICATION_TYPE = 'SUBSCRIBED_ENTERPRISE_ARTICLE'

function NotificationItem({
  notification,
  isPending,
  getEnterpriseById,
  onMarkAsRead,
}) {
  const isUnread = notification.readAt == null
  const enterprise =
    notification.type === ENTERPRISE_ARTICLE_NOTIFICATION_TYPE
      ? getEnterpriseById(notification.enterpriseId)
      : null
  const targetPath =
    notification.type === ENTERPRISE_ARTICLE_NOTIFICATION_TYPE
      ? enterprise
        ? `/tech-enterprises/${enterprise.slug}`
        : '/tech-enterprises'
      : notification.postId != null
        ? `/posts/${notification.postId}`
        : null

  const handleNotificationClick = (event) => {
    if (!isUnread || isPending) {
      return
    }

    const keepsNotificationPageOpen =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

    onMarkAsRead(notification.id, {
      refreshList: keepsNotificationPageOpen,
    })
  }

  const content = (
    <>
      <span
        className={`size-2 shrink-0 rounded-full ${
          isUnread
            ? 'bg-app-primary ring-4 ring-app-primary/20'
            : 'bg-transparent'
        }`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="app-chip">
            {getNotificationTypeLabel(notification.type)}
          </span>
          {notification.createdAt && (
            <time
              className="text-xs text-app-text-subtle"
              dateTime={notification.createdAt}
            >
              {formatDate(notification.createdAt)}
            </time>
          )}
        </div>
        <p
          className={`mt-1.5 text-sm leading-6 ${
            isUnread ? 'text-app-text' : 'text-app-text-muted'
          }`}
        >
          {notification.message}
        </p>
      </div>
    </>
  )

  return (
    <li
      className={`flex items-center gap-4 border-b border-app-border px-4 py-4 transition-colors last:border-b-0 hover:bg-app-surface-raised/50 sm:px-5 ${
        isUnread ? 'bg-app-primary/[0.05]' : ''
      }`}
    >
      {targetPath ? (
        <Link
          className="flex min-w-0 flex-1 items-center gap-3.5 rounded-lg"
          to={targetPath}
          onClick={handleNotificationClick}
        >
          {content}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-4">{content}</div>
      )}

      {isUnread && (
        <button
          className="app-btn app-btn-outline app-btn-xs"
          type="button"
          disabled={isPending}
          onClick={() => onMarkAsRead(notification.id)}
        >
          {isPending ? '처리 중...' : '읽음'}
        </button>
      )}
    </li>
  )
}

export default NotificationItem
