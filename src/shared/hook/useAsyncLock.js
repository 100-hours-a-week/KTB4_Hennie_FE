import { useCallback, useRef, useState } from 'react'

export const useAsyncLock = () => {
  const [isRunning, setIsRunning] = useState(false)
  const lockRef = useRef(false)

  const run = useCallback(async (task) => {
    if (lockRef.current) {
      return undefined
    }

    lockRef.current = true
    setIsRunning(true)

    try {
      return await task()
    } finally {
      lockRef.current = false
      setIsRunning(false)
    }
  }, [])

  return { isRunning, run }
}
