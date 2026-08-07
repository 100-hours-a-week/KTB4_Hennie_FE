import { useCallback, useSyncExternalStore } from 'react'

// TODO: API 연동 시 서버 상태로 교체. 지금은 정적 UI 확인용 메모리 저장소다.
// 목록 페이지와 상세 페이지가 같은 상태를 보도록 모듈 스코프에 둔다.
let subscribedCodes = new Set()
const listeners = new Set()

const subscribe = (listener) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => subscribedCodes

const setSubscribedCodes = (nextCodes) => {
  subscribedCodes = nextCodes
  listeners.forEach((listener) => listener())
}

export const useEnterpriseSubscription = () => {
  const codes = useSyncExternalStore(subscribe, getSnapshot)

  const isSubscribed = useCallback((code) => codes.has(code), [codes])

  const toggleSubscription = useCallback((code) => {
    if (!code) {
      return
    }

    const nextCodes = new Set(subscribedCodes)

    if (nextCodes.has(code)) {
      nextCodes.delete(code)
    } else {
      nextCodes.add(code)
    }

    setSubscribedCodes(nextCodes)
  }, [])

  return {
    subscribedCodes: codes,
    subscribedCount: codes.size,
    isSubscribed,
    toggleSubscription,
  }
}
