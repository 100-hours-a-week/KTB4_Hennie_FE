const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"; // CORS 에러 방지

// 에러를 구분 가능한 객체로 구분
export class ApiError extends Error {
  constructor({ status, statusText, body }) {
    super(getErrorMessage(body) || `API request failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.code = body?.code;
  }
}

export const get = (path, options = {}) =>
  request(path, {
    method: "GET",
    ...options,
  });

export const post = (path, body, options = {}) =>
  requestWithJson("POST", path, body, options);

export const put = (path, body, options = {}) =>
  requestWithJson("PUT", path, body, options);

export const patch = (path, body, options = {}) =>
  requestWithJson("PATCH", path, body, options);

export const del = (path, options = {}) =>
  request(path, {
    method: "DELETE",
    ...options,
  });

// GET, DELETE
export const request = async (path, options = {}) => {
  //  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      body,
    });
  }

  return body;
};

// fetch api 기반 http 통신 메서드
const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

// POST, PUT, PATCH
const requestWithJson = (method, path, body, options = {}) =>
  request(path, {
    method,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });

const getErrorMessage = (body) => {
  if (!body) {
    return "";
  }

  if (typeof body === "string") {
    return body;
  }

  return body.message || body.error || "";
};
