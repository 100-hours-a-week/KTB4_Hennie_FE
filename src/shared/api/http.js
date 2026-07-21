import client from './client'
import {
  ensureValidAccessToken,
  getRequestAccessToken,
  refreshAccessToken,
} from './tokenManager'

const request = async (path, options = {}) => {
  const authMode = options.auth ?? true
  const authRequired = authMode === true
  const skipAuthRefresh = Boolean(options.skipAuthRefresh)
  let refreshedBeforeRequest = false

  if (authRequired && !skipAuthRefresh) {
    refreshedBeforeRequest = await ensureValidAccessToken()
  }

  try {
    return await client.request(path, createRequestOptions(options, authMode))
  } catch (error) {
    if (
      error?.status === 401 &&
      authRequired &&
      !skipAuthRefresh &&
      !refreshedBeforeRequest &&
      (await refreshAccessToken())
    ) {
      return client.request(path, createRequestOptions(options, authMode))
    }

    throw error
  }
}

const createRequestOptions = (options, authMode) => {
  const { auth, skipAuthRefresh, headers, ...fetchOptions } = options
  const token = getRequestAccessToken(authMode)

  return {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

const createPathWithParams = (path, params) => {
  if (!params) {
    return path
  }

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `${path}?${queryString}` : path
}

const createBodyOptions = (body, options) => {
  if (body === undefined) {
    return options
  }

  if (body instanceof FormData) {
    return {
      ...options,
      body,
    }
  }

  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  }
}

export const get = (path, { params, ...options } = {}) =>
  request(createPathWithParams(path, params), {
    ...options,
    method: 'GET',
  })

export const post = (path, body, options = {}) =>
  request(path, createBodyOptions(body, { ...options, method: 'POST' }))

export const put = (path, body, options = {}) =>
  request(path, createBodyOptions(body, { ...options, method: 'PUT' }))

export const patch = (path, body, options = {}) =>
  request(path, createBodyOptions(body, { ...options, method: 'PATCH' }))

export const del = (path, options = {}) =>
  request(path, {
    ...options,
    method: 'DELETE',
  })
