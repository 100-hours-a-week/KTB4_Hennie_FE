import { useMemo } from 'react'
import { useAuth } from '../../features/auth/hook/useAuth'
import NotificationContext from '../../features/notification/hook/context'
import { useUnreadNotificationCount } from '../../features/notification/hook/useUnreadNotificationCount'

function NotificationProvider({ children }) {
  const { authStatus, currentUser } = useAuth()
  const sessionKey =
    authStatus === 'authenticated' ? (currentUser?.id ?? null) : null

  const { unreadCount, unreadCountError, refreshUnreadCount } =
    useUnreadNotificationCount({ sessionKey })

  const value = useMemo(
    () => ({
      unreadCount,
      unreadCountError,
      refreshUnreadCount,
    }),
    [refreshUnreadCount, unreadCount, unreadCountError],
  )

  return <NotificationContext value={value}>{children}</NotificationContext>
}

export default NotificationProvider
