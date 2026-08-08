import { useCallback, useState } from 'react'
import { useAuth } from '../../features/auth/hook/useAuth'
import NotificationList from '../../features/notification/components/NotificationList'
import { useNotification } from '../../features/notification/hook/useNotification'
import { useNotificationList } from '../../features/notification/hook/useNotificationList'
import { useNotificationReadActions } from '../../features/notification/hook/useNotificationReadActions'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function NotificationPage() {
  usePageTitle('알림 센터')

  const { currentUser } = useAuth()
  const { unreadCount, unreadCountError, refreshUnreadCount } =
    useNotification()
  const [error, setError] = useState('')
  const clearError = useCallback(() => setError(''), [])
  const reportError = useCallback((message) => setError(message), [])
  const sessionKey = currentUser?.id ?? null

  const {
    notifications,
    pagination,
    isLoading,
    isLoadingNext,
    refreshNotifications,
    loadNextPage,
  } = useNotificationList({ sessionKey, clearError, reportError })
  const { pendingReadIds, isMarkingAllRead, markAsRead, markAllAsRead } =
    useNotificationReadActions({
      sessionKey,
      clearError,
      refreshNotifications,
      refreshUnreadCount,
      reportError,
    })
  const hasNotifications = notifications.length > 0
  const isInitialLoading = isLoading && !hasNotifications
  const visibleError = error || unreadCountError

  const handleRetry = () => {
    refreshNotifications()
    refreshUnreadCount()
  }

  return (
    <section className="mx-auto w-full max-w-[720px] px-6 py-8 pb-24">
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">알림 센터</h1>
          <p className="mt-2 text-sm text-app-text-muted">
            새로운 개발자취(활동)과 구독한 기업의 개발 소식을 확인하세요.
          </p>
        </div>

        <button
          className="shrink-0 rounded-md border border-app-border px-3 py-2 text-xs font-medium text-app-text-muted transition-colors hover:border-app-primary/50 hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:opacity-50"
          type="button"
          disabled={unreadCount === 0 || isMarkingAllRead}
          onClick={markAllAsRead}
        >
          {isMarkingAllRead ? '처리 중...' : '전체 읽음'}
        </button>
      </header>

      {visibleError && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-app-error/40 bg-app-error/10 px-4 py-3"
          role="alert"
        >
          <p className="text-sm text-app-error">{visibleError}</p>
          <button
            className="shrink-0 text-xs font-medium text-app-text underline hover:text-white"
            type="button"
            onClick={handleRetry}
          >
            다시 시도
          </button>
        </div>
      )}

      {isInitialLoading ? (
        <p
          className="py-14 text-center text-sm text-app-text-muted"
          aria-live="polite"
        >
          알림을 불러오는 중입니다.
        </p>
      ) : hasNotifications ? (
        <NotificationList
          notifications={notifications}
          pagination={pagination}
          unreadCount={unreadCount}
          pendingReadIds={pendingReadIds}
          isLoadingNext={isLoadingNext}
          onLoadNextPage={loadNextPage}
          onMarkAsRead={markAsRead}
        />
      ) : (
        <div className="rounded-xl px-6 py-14 text-center">
          <h2 className="text-base font-bold">새로운 알림이 없습니다.</h2>
        </div>
      )}
    </section>
  )
}

export default NotificationPage
