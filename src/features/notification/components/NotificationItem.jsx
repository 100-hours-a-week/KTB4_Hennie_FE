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
          isUnread ? 'bg-app-primary' : 'bg-transparent'
        }`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xs font-medium text-app-primary">
            {getNotificationTypeLabel(notification.type)}
          </span>
          {notification.createdAt && (
            <time
              className="text-xs text-app-text-muted"
              dateTime={notification.createdAt}
            >
              {formatDate(notification.createdAt)}
            </time>
          )}
        </div>
        <p
          className={`mt-1 text-sm leading-6 ${
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
      className={`flex items-center gap-4 border-b border-app-border px-5 py-4 last:border-b-0 ${
        isUnread ? 'bg-app-surface-raised/60' : ''
      }`}
    >
      {targetPath ? (
        <Link
          className="flex min-w-0 flex-1 items-center gap-4 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
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
          className="shrink-0 rounded-md border border-app-border px-3 py-2 text-xs font-medium text-app-text-muted transition-colors hover:border-app-primary/50 hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:opacity-50"
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
