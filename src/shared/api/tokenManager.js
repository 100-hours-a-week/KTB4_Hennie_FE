import client, { ApiError } from './client'

const REFRESH_TOKEN_PATH = '/users/token/refresh'
const REFRESH_MARGIN_MS = 60 * 1000

// 액세스 토큰은 메모리에만 보관한다(리프레시 토큰은 HttpOnly 쿠키)
let accessToken = null
let accessTokenExpiresAt = 0
let refreshPromise = null

// ---------------------------------------------------------------------------
// 상태
// ---------------------------------------------------------------------------
export const getAccessToken = () => accessToken

export const hasAccessToken = () => Boolean(accessToken)

export const clearAccessToken = () => {
  accessToken = null
  accessTokenExpiresAt = 0
}

const setAccessToken = ({ token, expiresIn }) => {
  accessToken = token || null
  accessTokenExpiresAt = getExpiresAt(expiresIn)
}

const getExpiresAt = (expiresIn) => {
  const duration = Number(expiresIn)

  if (!Number.isFinite(duration) || duration <= 0) {
    return 0
  }

  return Date.now() + (duration > 86400 ? duration : duration * 1000)
}

const shouldRefreshAccessToken = () => {
  if (!accessToken || !accessTokenExpiresAt) {
    return false
  }

  return Date.now() >= accessTokenExpiresAt - REFRESH_MARGIN_MS
}

// ---------------------------------------------------------------------------
// 응답 파싱
// ---------------------------------------------------------------------------
// 로그인 응답은 data.token, 재발급 응답은 data 자체가 TokenInfo
const getTokenPayload = (response) => response?.data?.token ?? response?.data

export const storeAccessTokenFromResponse = (response) => {
  const tokenPayload = getTokenPayload(response)
  const token = tokenPayload?.accessToken

  setAccessToken({
    token,
    expiresIn: tokenPayload?.expiresIn,
  })

  return Boolean(token)
}

// ---------------------------------------------------------------------------
// 리프레시
// ---------------------------------------------------------------------------
export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = client
      .request(REFRESH_TOKEN_PATH, {
        method: 'POST',
        credentials: 'include',
      })
      .then((response) => storeAccessTokenFromResponse(response))
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

// 요청 전 호출: 만료 임박이면 선제 갱신, 실패 시 401을 던진다.
export const ensureValidAccessToken = async () => {
  if (hasAccessToken() && !shouldRefreshAccessToken()) {
    return false
  }

  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    throw new ApiError({
      status: 401,
      statusText: 'Unauthorized',
      body: { message: '로그인이 필요합니다.' },
    })
  }

  return true
}

// 헤더에 실을 토큰 결정 (auth 모드 반영)
export const getRequestAccessToken = (authMode) => {
  if (authMode === false) {
    return null
  }

  if (authMode === 'optional' && shouldRefreshAccessToken()) {
    return null
  }

  return accessToken
}
