import NotificationItem from './NotificationItem'

function NotificationList({
  notifications,
  pagination,
  unreadCount,
  pendingReadIds,
  isLoadingNext,
  getEnterpriseById,
  onLoadNextPage,
  onMarkAsRead,
}) {
  return (
    <>
      <p className="mb-2 text-right text-xs text-app-text-subtle">
        전체 {pagination.totalCount}개 · 안 읽음 {unreadCount}개
      </p>
      <ul className="app-list" aria-label="알림 목록">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isPending={pendingReadIds.has(notification.id)}
            getEnterpriseById={getEnterpriseById}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </ul>

      {pagination.hasNext && (
        <div className="mt-6 text-center">
          <button
            className="app-btn app-btn-outline app-btn-sm"
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
