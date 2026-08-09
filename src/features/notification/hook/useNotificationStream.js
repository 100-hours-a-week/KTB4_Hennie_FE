import { useEffect, useRef } from 'react'
import { EventSource } from 'eventsource'
import {
  ensureValidAccessToken,
  getRequestAccessToken,
  refreshAccessToken,
} from '../../../shared/api/tokenManager'

const NOTIFICATION_STREAM_URL = '/api/notifications/stream'
const CONNECTED_EVENT = 'connected'
const NOTIFICATION_CREATED_EVENT = 'notification.created'
const SYNC_DEBOUNCE_MS = 150
const RECENT_EVENT_ID_LIMIT = 200
const SERVER_RETRY_BASE_MS = 1000
const SERVER_RETRY_MAX_MS = 30_000

const parseEventPayload = (event) => {
  try {
    return JSON.parse(event.data)
  } catch {
    return null
  }
}

const getRetryDelay = (attempt) => {
  const exponentialDelay = Math.min(
    SERVER_RETRY_BASE_MS * 2 ** attempt,
    SERVER_RETRY_MAX_MS,
  )
  const jitter = 0.8 + Math.random() * 0.4

  return Math.min(Math.round(exponentialDelay * jitter), SERVER_RETRY_MAX_MS)
}

export function useNotificationStream({ sessionKey, onSync }) {
  const recentEventIdsRef = useRef(new Set())
  const syncTimerRef = useRef(null)

  useEffect(() => {
    if (sessionKey == null) {
      return undefined
    }

    const recentEventIds = recentEventIdsRef.current
    let isActive = true
    let eventSource = null
    let serverRetryTimer = null
    let serverRetryAttempt = 0
    let authorizationRetryCount = 0

    const clearServerRetryTimer = () => {
      if (serverRetryTimer != null) {
        clearTimeout(serverRetryTimer)
        serverRetryTimer = null
      }
    }

    const scheduleSync = () => {
      if (syncTimerRef.current != null) {
        clearTimeout(syncTimerRef.current)
      }

      syncTimerRef.current = setTimeout(() => {
        syncTimerRef.current = null

        if (isActive) {
          onSync()
        }
      }, SYNC_DEBOUNCE_MS)
    }

    const rememberEventId = (eventId) => {
      if (!eventId) {
        return true
      }

      if (recentEventIds.has(eventId)) {
        return false
      }

      recentEventIds.add(eventId)

      if (recentEventIds.size > RECENT_EVENT_ID_LIMIT) {
        const oldestEventId = recentEventIds.values().next().value
        recentEventIds.delete(oldestEventId)
      }

      return true
    }

    const scheduleServerReconnect = (connect) => {
      clearServerRetryTimer()
      const retryDelay = getRetryDelay(serverRetryAttempt)
      serverRetryAttempt += 1

      serverRetryTimer = setTimeout(() => {
        serverRetryTimer = null

        if (isActive) {
          connect()
        }
      }, retryDelay)
    }

    const connect = () => {
      if (!isActive) {
        return
      }

      eventSource?.close()
      let accessTokenPreparationFailed = false

      const source = new EventSource(NOTIFICATION_STREAM_URL, {
        fetch: async (input, init) => {
          try {
            await ensureValidAccessToken()
          } catch (error) {
            accessTokenPreparationFailed = true
            throw error
          }

          const accessToken = getRequestAccessToken(true)

          return fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          })
        },
      })
      eventSource = source

      source.addEventListener('open', () => {
        if (!isActive || eventSource !== source) {
          return
        }

        authorizationRetryCount = 0
        serverRetryAttempt = 0
        clearServerRetryTimer()
        onSync()
      })

      source.addEventListener(CONNECTED_EVENT, () => {
        // 연결 확인용 transport event이므로 별도 REST 재조회는 하지 않는다.
      })

      source.addEventListener(NOTIFICATION_CREATED_EVENT, (event) => {
        if (!isActive || eventSource !== source) {
          return
        }

        const payload = parseEventPayload(event)
        const recipientId = payload?.recipientId

        if (recipientId != null && String(recipientId) !== String(sessionKey)) {
          return
        }

        const eventId = event.lastEventId || payload?.eventId

        if (rememberEventId(eventId)) {
          scheduleSync()
        }
      })

      source.addEventListener('error', async (event) => {
        if (!isActive || eventSource !== source) {
          return
        }

        if (accessTokenPreparationFailed) {
          source.close()
          console.error('알림 실시간 연결을 위한 로그인 갱신에 실패했습니다.')
          return
        }

        if (event.code === 401 || event.code === 403) {
          source.close()

          if (authorizationRetryCount >= 1) {
            console.error('알림 실시간 연결 인증에 실패했습니다.', event)
            return
          }

          authorizationRetryCount += 1
          const refreshed = await refreshAccessToken()

          if (isActive && eventSource === source && refreshed) {
            connect()
          }

          return
        }

        if (event.code != null && event.code >= 500) {
          source.close()
          scheduleServerReconnect(connect)
        }
      })
    }

    queueMicrotask(() => {
      if (isActive) {
        connect()
      }
    })

    return () => {
      isActive = false
      eventSource?.close()
      eventSource = null
      clearServerRetryTimer()
      recentEventIds.clear()

      if (syncTimerRef.current != null) {
        clearTimeout(syncTimerRef.current)
        syncTimerRef.current = null
      }
    }
  }, [onSync, sessionKey])
}
