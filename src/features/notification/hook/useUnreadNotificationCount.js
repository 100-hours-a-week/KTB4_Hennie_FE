import { useCallback, useEffect, useRef, useState } from 'react'
import { getUnreadNotificationCount } from '../api/notificationApi'
import { getNotificationErrorMessage } from '../utils/notificationErrorMessage'

export function useUnreadNotificationCount({ sessionKey }) {
  const activeSessionKeyRef = useRef(sessionKey)
  const requestControllerRef = useRef(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadCountError, setUnreadCountError] = useState('')

  const resetUnreadCount = useCallback(() => {
    requestControllerRef.current?.abort()
    requestControllerRef.current = null
    setUnreadCount(0)
    setUnreadCountError('')
  }, [])

  const refreshUnreadCount = useCallback(async () => {
    const requestSessionKey = sessionKey

    if (
      requestSessionKey == null ||
      activeSessionKeyRef.current !== requestSessionKey
    ) {
      return false
    }

    requestControllerRef.current?.abort()
    const controller = new AbortController()
    requestControllerRef.current = controller
    setUnreadCountError('')

    try {
      const nextUnreadCount = await getUnreadNotificationCount({
        signal: controller.signal,
      })

      if (
        controller.signal.aborted ||
        activeSessionKeyRef.current !== requestSessionKey
      ) {
        return false
      }

      setUnreadCount(nextUnreadCount)
      return true
    } catch (error) {
      if (
        error.name !== 'AbortError' &&
        activeSessionKeyRef.current === requestSessionKey
      ) {
        console.error('읽지 않은 알림 개수 조회 실패', error)
        setUnreadCountError(
          getNotificationErrorMessage(
            error,
            '읽지 않은 알림 개수를 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
          ),
        )
      }

      return false
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
      }
    }
  }, [sessionKey])

  useEffect(() => {
    let isActive = true

    activeSessionKeyRef.current = sessionKey

    queueMicrotask(() => {
      if (!isActive) {
        return
      }

      resetUnreadCount()

      if (sessionKey != null) {
        refreshUnreadCount()
      }
    })

    return () => {
      isActive = false
      activeSessionKeyRef.current = null
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
    }
  }, [refreshUnreadCount, resetUnreadCount, sessionKey])

  return {
    unreadCount,
    unreadCountError,
    refreshUnreadCount,
  }
}
