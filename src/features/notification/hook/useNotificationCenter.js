import { useCallback, useState } from 'react'
import { useAuth } from '../../auth/hook/useAuth'
import { useNotification } from './useNotification'
import { useNotificationList } from './useNotificationList'
import { useNotificationReadActions } from './useNotificationReadActions'

export function useNotificationCenter() {
  const { currentUser } = useAuth()
  const {
    unreadCount,
    unreadCountError,
    notificationSyncVersion,
    refreshUnreadCount,
  } = useNotification()
  const [error, setError] = useState('')
  const clearError = useCallback(() => setError(''), [])
  const reportError = useCallback((message) => setError(message), [])
  const sessionKey = currentUser?.id ?? null
  const {
    notifications,
    pagination,
    isLoadingNext,
    refreshNotifications,
    loadNextPage,
  } = useNotificationList({
    sessionKey,
    refreshSignal: notificationSyncVersion,
    clearError,
    reportError,
  })
  const { pendingReadIds, isMarkingAllRead, markAsRead, markAllAsRead } =
    useNotificationReadActions({
      sessionKey,
      clearError,
      refreshNotifications,
      refreshUnreadCount,
      reportError,
    })

  const refresh = useCallback(
    () =>
      Promise.all([refreshNotifications(), refreshUnreadCount()]).then(
        ([didRefreshNotifications, didRefreshUnreadCount]) =>
          didRefreshNotifications && didRefreshUnreadCount,
      ),
    [refreshNotifications, refreshUnreadCount],
  )

  return {
    notifications,
    pagination,
    unreadCount,
    pendingReadIds,
    isLoadingNext,
    isMarkingAllRead,
    error: error || unreadCountError,
    refresh,
    loadNextPage,
    markAsRead,
    markAllAsRead,
  }
}
