import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '../../features/auth/hook/useAuth'
import NotificationContext from '../../features/notification/hook/context'
import { useNotificationStream } from '../../features/notification/hook/useNotificationStream'
import { useUnreadNotificationCount } from '../../features/notification/hook/useUnreadNotificationCount'

function NotificationProvider({ children }) {
  const { authStatus, currentUser } = useAuth()
  const sessionKey =
    authStatus === 'authenticated' ? (currentUser?.id ?? null) : null
  const [notificationSyncVersion, setNotificationSyncVersion] = useState(0)

  const { unreadCount, unreadCountError, refreshUnreadCount } =
    useUnreadNotificationCount({ sessionKey })
  const syncNotifications = useCallback(() => {
    refreshUnreadCount()
    setNotificationSyncVersion((version) => version + 1)
  }, [refreshUnreadCount])

  useNotificationStream({ sessionKey, onSync: syncNotifications })

  const value = useMemo(
    () => ({
      unreadCount,
      unreadCountError,
      notificationSyncVersion,
      refreshUnreadCount,
    }),
    [
      notificationSyncVersion,
      refreshUnreadCount,
      unreadCount,
      unreadCountError,
    ],
  )

  return <NotificationContext value={value}>{children}</NotificationContext>
}

export default NotificationProvider
