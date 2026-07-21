import client from './client'

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
  client.request(createPathWithParams(path, params), {
    ...options,
    method: 'GET',
  })

export const post = (path, body, options = {}) =>
  client.request(path, createBodyOptions(body, { ...options, method: 'POST' }))

export const put = (path, body, options = {}) =>
  client.request(path, createBodyOptions(body, { ...options, method: 'PUT' }))

export const patch = (path, body, options = {}) =>
  client.request(path, createBodyOptions(body, { ...options, method: 'PATCH' }))

export const del = (path, options = {}) =>
  client.request(path, {
    ...options,
    method: 'DELETE',
  })
