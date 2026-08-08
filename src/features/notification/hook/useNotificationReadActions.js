import { useCallback, useEffect, useRef, useState } from 'react'
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationApi'
import { getNotificationErrorMessage } from '../utils/notificationErrorMessage'

export function useNotificationReadActions({
  sessionKey,
  clearError,
  refreshNotifications,
  refreshUnreadCount,
  reportError,
}) {
  const activeSessionKeyRef = useRef(sessionKey)
  const pendingReadIdsRef = useRef(new Set())
  const isMarkingAllReadRef = useRef(false)
  const [pendingReadIds, setPendingReadIds] = useState(new Set())
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  const resetReadActions = useCallback(() => {
    pendingReadIdsRef.current = new Set()
    isMarkingAllReadRef.current = false
    setPendingReadIds(new Set())
    setIsMarkingAllRead(false)
  }, [])

  useEffect(() => {
    let isActive = true

    activeSessionKeyRef.current = sessionKey

    queueMicrotask(() => {
      if (isActive) {
        resetReadActions()
      }
    })

    return () => {
      isActive = false
      activeSessionKeyRef.current = null
    }
  }, [resetReadActions, sessionKey])

  const markAsRead = useCallback(
    async (notificationId, { refreshList = true } = {}) => {
      if (
        sessionKey == null ||
        notificationId == null ||
        pendingReadIdsRef.current.has(notificationId)
      ) {
        return false
      }

      const requestSessionKey = sessionKey
      const nextPendingIds = new Set(pendingReadIdsRef.current)
      nextPendingIds.add(notificationId)
      pendingReadIdsRef.current = nextPendingIds
      setPendingReadIds(nextPendingIds)
      clearError()

      try {
        await markNotificationAsRead(notificationId)

        const unreadCountRefresh = refreshUnreadCount()

        if (!refreshList || activeSessionKeyRef.current !== requestSessionKey) {
          return await unreadCountRefresh
        }

        const [didRefreshNotifications, didRefreshUnreadCount] =
          await Promise.all([refreshNotifications(), unreadCountRefresh])

        return didRefreshNotifications && didRefreshUnreadCount
      } catch (error) {
        if (activeSessionKeyRef.current === requestSessionKey) {
          console.error('알림 읽음 처리 실패', error)
          reportError(
            getNotificationErrorMessage(
              error,
              '선택한 알림을 읽음 처리하지 못했어요. 잠시 후 다시 시도해주세요.',
            ),
          )
        }

        return false
      } finally {
        if (activeSessionKeyRef.current === requestSessionKey) {
          const remainingPendingIds = new Set(pendingReadIdsRef.current)
          remainingPendingIds.delete(notificationId)
          pendingReadIdsRef.current = remainingPendingIds
          setPendingReadIds(remainingPendingIds)
        }
      }
    },
    [
      clearError,
      refreshNotifications,
      refreshUnreadCount,
      reportError,
      sessionKey,
    ],
  )

  const markAllAsRead = useCallback(async () => {
    if (sessionKey == null || isMarkingAllReadRef.current) {
      return false
    }

    const requestSessionKey = sessionKey
    isMarkingAllReadRef.current = true
    setIsMarkingAllRead(true)
    clearError()

    try {
      await markAllNotificationsAsRead()

      if (activeSessionKeyRef.current !== requestSessionKey) {
        return false
      }

      const [didRefreshNotifications, didRefreshUnreadCount] =
        await Promise.all([refreshNotifications(), refreshUnreadCount()])

      return didRefreshNotifications && didRefreshUnreadCount
    } catch (error) {
      if (activeSessionKeyRef.current === requestSessionKey) {
        console.error('알림 전체 읽음 처리 실패', error)
        reportError(
          getNotificationErrorMessage(
            error,
            '모든 알림을 읽음 처리하지 못했어요. 잠시 후 다시 시도해주세요.',
          ),
        )
      }

      return false
    } finally {
      if (activeSessionKeyRef.current === requestSessionKey) {
        isMarkingAllReadRef.current = false
        setIsMarkingAllRead(false)
      }
    }
  }, [
    clearError,
    refreshNotifications,
    refreshUnreadCount,
    reportError,
    sessionKey,
  ])

  return {
    pendingReadIds,
    isMarkingAllRead,
    markAsRead,
    markAllAsRead,
  }
}
