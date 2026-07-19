import {
  getAccessToken,
  getApiUrl,
  hasAccessToken,
  refreshAccessToken,
  shouldRefreshAccessToken,
} from './session'

class ApiError extends Error {
  constructor({ status, statusText, body }) {
    super(getErrorMessage(body) || `API request failed: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.body = body
    this.code = body?.code
  }
}

export const get = (path, options = {}) =>
  request(path, {
    method: 'GET',
    ...options,
  })

export const post = (path, body, options = {}) =>
  requestWithJson('POST', path, body, options)

export const put = (path, body, options = {}) =>
  requestWithJson('PUT', path, body, options)

export const patch = (path, body, options = {}) =>
  requestWithJson('PATCH', path, body, options)

export const del = (path, options = {}) =>
  request(path, {
    method: 'DELETE',
    ...options,
  })

const request = async (path, options = {}) => {
  const authMode = options.auth ?? true
  const authRequired = authMode === true
  const skipAuthRefresh = Boolean(options.skipAuthRefresh)
  let refreshedBeforeRequest = false

  // 토큰 확보
  if (authRequired && !skipAuthRefresh) {
    refreshedBeforeRequest = await ensureValidAccessToken()
  }

  // 헤더 조립
  const response = await fetch(
    getApiUrl(path),
    createFetchOptions(options, { authMode }),
  )
  const body = await parseResponseBody(response)

  if (!response.ok) {
    if (
      response.status === 401 &&
      authRequired &&
      !skipAuthRefresh &&
      !refreshedBeforeRequest &&
      (await refreshAccessToken())
    ) {
      const retryResponse = await fetch(
        getApiUrl(path),
        createFetchOptions(options, { authMode }),
      )
      const retryBody = await parseResponseBody(retryResponse)

      if (retryResponse.ok) {
        return retryBody
      }

      throw new ApiError({
        status: retryResponse.status,
        statusText: retryResponse.statusText,
        body: retryBody,
      })
    }

    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  return body
}

const ensureValidAccessToken = async () => {
  if (hasAccessToken() && !shouldRefreshAccessToken()) {
    return false
  }

  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    throw new ApiError({
      status: 401,
      statusText: 'Unauthorized',
      body: {
        message: '로그인이 필요합니다.',
      },
    })
  }

  return true
}

const createFetchOptions = (options, { authMode }) => {
  const { auth, skipAuthRefresh, headers, ...fetchOptions } = options
  const token = getRequestAccessToken(authMode)

  return {
    credentials: 'include',
    ...fetchOptions,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

const getRequestAccessToken = (authMode) => {
  if (authMode === false) {
    return null
  }

  if (authMode === 'optional' && shouldRefreshAccessToken()) {
    return null
  }

  return getAccessToken()
}

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || ''

  if (response.status === 204) {
    return null
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

const requestWithJson = (method, path, body, options = {}) =>
  request(path, {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  })

const getErrorMessage = (body) => {
  if (!body) {
    return ''
  }

  if (typeof body === 'string') {
    return body
  }

  return body.message || body.error || ''
}

const STATUS_ERROR_MESSAGE = {
  400: '입력값을 다시 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  409: '이미 처리된 정보가 있습니다.',
}

export const getApiErrorMessage = (
  error,
  fallbackMessage = '요청에 실패했습니다.',
) => {
  if (!error) {
    return fallbackMessage
  }

  if (STATUS_ERROR_MESSAGE[error.status]) {
    return STATUS_ERROR_MESSAGE[error.status]
  }

  if (error.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return fallbackMessage
}
