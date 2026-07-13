import {
  clearAccessToken,
  getAccessToken,
  hasAccessToken,
  setAccessToken,
  shouldRefreshAccessToken,
} from "../store/tokenStore.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"; // CORS 에러 방지
const REFRESH_TOKEN_PATH = "/users/token/refresh";
let refreshPromise = null;

// 에러를 구분 가능한 객체로 구분
class ApiError extends Error {
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
const request = async (path, options = {}) => {
  const authMode = options.auth ?? true;
  const authRequired = authMode === true;
  const skipAuthRefresh = Boolean(options.skipAuthRefresh);
  let refreshedBeforeRequest = false;

  if (authRequired && !skipAuthRefresh) {
    refreshedBeforeRequest = await ensureValidAccessToken();
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    createFetchOptions(options, { authMode })
  );
  const body = await parseResponseBody(response);

  if (!response.ok) {
    if (
      response.status === 401 &&
      authRequired &&
      !skipAuthRefresh &&
      !refreshedBeforeRequest &&
      (await refreshAccessToken())
    ) {
      const retryResponse = await fetch(
        `${API_BASE_URL}${path}`,
        createFetchOptions(options, { authMode })
      );
      const retryBody = await parseResponseBody(retryResponse);

      if (retryResponse.ok) {
        return retryBody;
      }

      throw new ApiError({
        status: retryResponse.status,
        statusText: retryResponse.statusText,
        body: retryBody,
      });
    }

    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      body,
    });
  }

  return body;
};

const ensureValidAccessToken = async () => {
  if (hasAccessToken() && !shouldRefreshAccessToken()) {
    return false;
  }

  const refreshed = await refreshAccessToken();

  if (!refreshed) {
    throw new ApiError({
      status: 401,
      statusText: "Unauthorized",
      body: {
        message: "로그인이 필요합니다.",
      },
    });
  }

  return true;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = requestAccessToken()
      .then((response) => {
        const data =
          response?.data?.token || response?.data || response?.token || response;

        setAccessToken({
          token: data?.accessToken,
          expiresIn: data?.expiresIn,
        });

        return Boolean(data?.accessToken);
      })
      .catch(() => {
        clearAccessToken();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const requestAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}${REFRESH_TOKEN_PATH}`, {
    method: "POST",
  });
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

const createFetchOptions = (options, { authMode }) => {
  const { auth, skipAuthRefresh, headers, ...fetchOptions } = options;
  const token = getRequestAccessToken(authMode);

  return {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const getRequestAccessToken = (authMode) => {
  if (authMode === false) {
    return null;
  }

  if (authMode === "optional" && shouldRefreshAccessToken()) {
    return null;
  }

  return getAccessToken();
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
