import { useCallback, useEffect, useState } from 'react'
import {
  login as loginApi,
  logout as logoutApi,
  restoreAuthSession,
} from './api'
import { AuthContext } from './context'

let restorePromise = null

const restoreSessionOnce = () => {
  if (!restorePromise) {
    restorePromise = restoreAuthSession().finally(() => {
      restorePromise = null
    })
  }

  return restorePromise
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let ignore = false

    restoreSessionOnce().then((restoredUser) => {
      if (ignore) {
        return
      }

      setUser(restoredUser)
      setStatus(restoredUser ? 'authenticated' : 'unauthenticated')
    })

    return () => {
      ignore = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginApi(credentials)
    setUser(loggedInUser)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } finally {
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
