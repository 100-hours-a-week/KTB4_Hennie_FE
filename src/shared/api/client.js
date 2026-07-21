const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const getErrorMessage = (body) => {
  if (!body) {
    return ''
  }

  if (typeof body === 'string') {
    return body
  }

  return body.message || body.error || ''
}

const parseResponseBody = async (response) => {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export class ApiError extends Error {
  constructor({ status, statusText, body }) {
    super(getErrorMessage(body) || `API request failed: ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.body = body
    this.code = body?.code ?? body?.message
  }
}

export const createClient = ({ baseUrl, defaultOptions = {} }) => ({
  async request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    })
    const body = await parseResponseBody(response)

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        statusText: response.statusText,
        body,
      })
    }

    return body
  },
})

const client = createClient({
  baseUrl: API_BASE_URL,
})

export default client
