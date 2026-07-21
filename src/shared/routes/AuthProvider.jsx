import { useCallback, useEffect, useState } from 'react'
import {
  login as requestLogin,
  logout as requestLogout,
  restoreAuthSession,
} from '../../features/auth/api/authApi'
import AuthContext from '../../features/auth/hook/context'
import { normalizeUser } from '../../features/auth/utils/normalizeUser'
import { clearAccessToken } from '../api/tokenManager'

let restorePromise = null

// single-flight 패턴 방지용
const restoreSessionOnce = () => {
  if (!restorePromise) {
    restorePromise = restoreAuthSession().finally(() => {
      restorePromise = null
    })
  }

  return restorePromise
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authStatus, setAuthStatus] = useState('checking')

  // 새로고침 시 refresh 쿠키로 세션 살리는 과정
  useEffect(() => {
    let ignore = false

    restoreSessionOnce().then((restoredUser) => {
      if (ignore) {
        return
      }

      setCurrentUser(restoredUser)
      setAuthStatus(restoredUser ? 'authenticated' : 'unauthenticated')
    })

    return () => {
      ignore = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const user = await requestLogin(credentials)

    setCurrentUser(user)
    setAuthStatus('authenticated')

    return user
  }, [])

  const updateCurrentUser = useCallback((user) => {
    setCurrentUser((current) => {
      const mergedUser = {
        ...(current || {}),
        ...(user || {}),
      }

      return normalizeUser(mergedUser) || current
    })
  }, [])

  const clearAuthSession = useCallback(() => {
    clearAccessToken()
    setCurrentUser(null)
    setAuthStatus('unauthenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await requestLogout()
    } finally {
      clearAuthSession()
    }
  }, [clearAuthSession])

  return (
    <AuthContext
      value={{
        currentUser,
        authStatus,
        login,
        logout,
        updateCurrentUser,
        clearAuthSession,
      }}
    >
      {children}
    </AuthContext>
  )
}

export default AuthProvider
