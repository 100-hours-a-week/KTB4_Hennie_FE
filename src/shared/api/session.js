const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const REFRESH_MARGIN_MS = 60 * 1000

let accessToken = null
let accessTokenExpiresAt = 0
let currentUser = null
let refreshPromise = null

export const setAccessToken = ({ token, expiresIn }) => {
  accessToken = token
  accessTokenExpiresAt = getExpiresAt(expiresIn)
  currentUser = currentUser || getUserFromAccessToken(token)
}

export const clearAccessToken = () => {
  accessToken = null
  accessTokenExpiresAt = 0
  currentUser = null
}

export const getAccessToken = () => accessToken

export const getCurrentUser = () =>
  currentUser ?? getUserFromAccessToken(accessToken)

export const setCurrentUser = (user) => {
  if (!user) {
    currentUser = null
    return
  }

  currentUser = {
    ...(getUserFromAccessToken(accessToken) || {}),
    ...(currentUser || {}),
    ...user,
  }
}

export const hasAccessToken = () => Boolean(accessToken)

export const shouldRefreshAccessToken = () => {
  if (!accessToken || !accessTokenExpiresAt) {
    return false
  }

  return Date.now() >= accessTokenExpiresAt - REFRESH_MARGIN_MS
}

export const getApiUrl = (path) => `${API_BASE_URL}${path}`

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken()
      .then((response) => {
        const data = extractTokenData(response)

        setAccessToken({
          token: data?.accessToken,
          expiresIn: data?.expiresIn,
        })

        return Boolean(data?.accessToken)
      })
      .catch(() => {
        clearAccessToken()
        return false
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export const extractTokenData = (response) =>
  response?.data?.token || response?.data || response?.token || response

const requestNewAccessToken = async () => {
  const response = await fetch(getApiUrl('/users/token/refresh'), {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`token refresh failed: ${response.status}`)
  }

  return response.status === 204 ? null : response.json()
}

const getExpiresAt = (expiresIn) => {
  const duration = Number(expiresIn)

  if (!Number.isFinite(duration) || duration <= 0) {
    return 0
  }

  return Date.now() + (duration > 86400 ? duration : duration * 1000)
}

const getUserFromAccessToken = (token) => {
  const payload = parseJwtPayload(token)

  if (!payload?.sub) {
    return null
  }

  return {
    id: Number(payload.sub),
    email: payload.email,
    nickname: payload.nickname,
  }
}

const parseJwtPayload = (token) => {
  try {
    const payload = token?.split('.')[1]

    if (!payload) {
      return null
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

    return JSON.parse(atob(paddedBase64))
  } catch {
    return null
  }
}
