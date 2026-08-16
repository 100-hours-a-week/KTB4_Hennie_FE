import { useEffect } from 'react'
import { SENTINEL_ROOT_MARGIN } from '../utils/constants'

export function useInfiniteScroll({ targetRef, enabled, onIntersect }) {
  useEffect(() => {
    const target = targetRef.current

    if (!target || !enabled) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        observer.disconnect()
        onIntersect()
      },
      {
        rootMargin: SENTINEL_ROOT_MARGIN,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [enabled, onIntersect, targetRef])
}
