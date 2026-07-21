import { get, post } from '../../../shared/api/http'
import {
  clearAccessToken,
  refreshAccessToken,
  storeAccessTokenFromResponse,
} from '../../../shared/api/tokenManager'
import { normalizeUser } from '../utils/normalizeUser'

export const signup = ({ email, password, nickname, profileUrl }) =>
  post(
    '/users/signup',
    {
      email,
      password,
      nickname,
      ...(profileUrl ? { profileUrl } : {}),
    },
    {
      auth: false,
      skipAuthRefresh: true,
    },
  )

export const login = async ({ email, password }) => {
  const response = await post(
    '/users/login',
    { email, password },
    {
      auth: false,
      skipAuthRefresh: true,
      credentials: 'include',
    },
  )

  storeAccessTokenFromResponse(response)
  return normalizeUser(response?.data?.user)
}

export const restoreAuthSession = async () => {
  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    return null
  }

  try {
    return await getCurrentUser()
  } catch {
    clearAccessToken()
    return null
  }
}

export const logout = async () => {
  try {
    return await post('/users/logout', undefined, {
      auth: true,
      credentials: 'include',
    })
  } finally {
    clearAccessToken()
  }
}

const getCurrentUser = async () => {
  const response = await get('/users/myInfo', { auth: true })

  return normalizeUser(response?.data)
}
