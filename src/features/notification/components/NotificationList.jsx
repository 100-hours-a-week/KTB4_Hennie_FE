import NotificationItem from './NotificationItem'

function NotificationList({
  notifications,
  pagination,
  unreadCount,
  pendingReadIds,
  isLoadingNext,
  onLoadNextPage,
  onMarkAsRead,
}) {
  return (
    <>
      <p className="my-5 text-right text-xs text-app-text-muted">
        전체 {pagination.totalCount}개 · 안 읽음 {unreadCount}개
      </p>
      <ul
        className="overflow-hidden rounded-xl border border-app-border bg-app-surface"
        aria-label="알림 목록"
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isPending={pendingReadIds.has(notification.id)}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </ul>

      {pagination.hasNext && (
        <div className="mt-6 text-center">
          <button
            className="h-10 rounded-md border border-app-border px-5 text-sm font-medium text-app-text-muted transition-colors hover:border-app-primary/50 hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:opacity-50"
            type="button"
            disabled={isLoadingNext}
            onClick={onLoadNextPage}
          >
            {isLoadingNext ? '불러오는 중...' : '알림 더 보기'}
          </button>
        </div>
      )}
    </>
  )
}

export default NotificationList
