import { get, post } from '../../shared/api/client'
import {
  clearAccessToken,
  extractTokenData,
  getCurrentUser,
  refreshAccessToken,
  setAccessToken,
  setCurrentUser,
} from '../../shared/api/session'

export const login = async ({ email, password }) => {
  const response = await post(
    '/users/login',
    {
      email,
      password,
    },
    {
      auth: false,
      skipAuthRefresh: true,
    },
  )

  saveAuthToken(response)
  return getCurrentUser() || restoreCurrentUser()
}

export const restoreAuthSession = async () => {
  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    return null
  }

  try {
    return await restoreCurrentUser()
  } catch {
    clearAccessToken()
    return null
  }
}

const restoreCurrentUser = async () => {
  const response = await get('/users/myInfo', { auth: true })
  const user = response?.data || response

  setCurrentUser(user)
  return getCurrentUser()
}

export const logout = async () => {
  try {
    return await post('/users/logout', undefined, {
      auth: true,
    })
  } finally {
    clearAccessToken()
  }
}

const saveAuthToken = (response) => {
  const data = extractTokenData(response)

  const user = response?.data?.user || response?.user

  if (user) {
    setCurrentUser(user)
  }

  setAccessToken({
    token: data?.accessToken,
    expiresIn: data?.expiresIn,
  })
}
