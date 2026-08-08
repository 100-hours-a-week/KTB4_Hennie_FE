import { useCallback, useEffect, useRef, useState } from 'react'
import { getNotificationList } from '../api/notificationApi'
import { getNotificationErrorMessage } from '../utils/notificationErrorMessage'
import { NOTIFICATION_PAGE_SIZE } from '../../../shared/utils/constants'

const INITIAL_PAGINATION = {
  page: 1,
  size: NOTIFICATION_PAGE_SIZE,
  totalCount: 0,
  totalPages: 1,
  hasNext: false,
}

const mergeNotifications = (currentNotifications, nextNotifications) => {
  const knownIds = new Set(currentNotifications.map(({ id }) => id))

  return [
    ...currentNotifications,
    ...nextNotifications.filter(({ id }) => !knownIds.has(id)),
  ]
}

export function useNotificationList({
  sessionKey,
  refreshSignal,
  clearError,
  reportError,
}) {
  const requestControllerRef = useRef(null)
  const lastRefreshSignalRef = useRef(refreshSignal)
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState(INITIAL_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNext, setIsLoadingNext] = useState(false)

  const resetNotifications = useCallback(() => {
    requestControllerRef.current?.abort()
    requestControllerRef.current = null
    setNotifications([])
    setPagination(INITIAL_PAGINATION)
    setIsLoading(false)
    setIsLoadingNext(false)
  }, [])

  const refreshNotifications = useCallback(
    async ({ page = 1, append = false } = {}) => {
      if (sessionKey == null) {
        return false
      }

      requestControllerRef.current?.abort()
      const controller = new AbortController()
      requestControllerRef.current = controller

      if (append) {
        setIsLoadingNext(true)
      } else {
        setIsLoading(true)
        setIsLoadingNext(false)
      }
      clearError()

      try {
        const notificationList = await getNotificationList(
          { page, size: NOTIFICATION_PAGE_SIZE },
          { signal: controller.signal },
        )

        if (controller.signal.aborted) {
          return false
        }

        setNotifications((currentNotifications) =>
          append
            ? mergeNotifications(
                currentNotifications,
                notificationList.notifications,
              )
            : notificationList.notifications,
        )
        setPagination(notificationList.pagination)
        return true
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('알림 조회 실패', error)
          reportError(
            getNotificationErrorMessage(
              error,
              '알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
            ),
          )
        }

        return false
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null
          setIsLoading(false)
          setIsLoadingNext(false)
        }
      }
    },
    [clearError, reportError, sessionKey],
  )

  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (!isActive) {
        return
      }

      resetNotifications()
      clearError()

      if (sessionKey != null) {
        refreshNotifications()
      }
    })

    return () => {
      isActive = false
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
    }
  }, [clearError, refreshNotifications, resetNotifications, sessionKey])

  useEffect(() => {
    if (lastRefreshSignalRef.current === refreshSignal) {
      return undefined
    }

    lastRefreshSignalRef.current = refreshSignal
    let isActive = true

    queueMicrotask(() => {
      if (isActive && sessionKey != null) {
        refreshNotifications()
      }
    })

    return () => {
      isActive = false
    }
  }, [refreshNotifications, refreshSignal, sessionKey])

  const loadNextPage = useCallback(() => {
    if (!pagination.hasNext || isLoading || isLoadingNext) {
      return Promise.resolve(false)
    }

    return refreshNotifications({
      page: pagination.page + 1,
      append: true,
    })
  }, [
    isLoading,
    isLoadingNext,
    pagination.hasNext,
    pagination.page,
    refreshNotifications,
  ])

  return {
    notifications,
    pagination,
    isLoadingNext,
    refreshNotifications,
    loadNextPage,
  }
}
