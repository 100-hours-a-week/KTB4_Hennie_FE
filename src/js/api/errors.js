export const API_ERROR_CODE = {
  INVALID_REQUEST: "INVALID_REQUEST",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  NICKNAME_ALREADY_EXISTS: "NICKNAME_ALREADY_EXISTS", // 409
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SAME_AS_CURRENT_PASSWORD: "SAME_AS_CURRENT_PASSWORD",
  POST_NOT_FOUND: "POST_NOT_FOUND", // 404
};

const STATUS_ERROR_MESSAGE = {
  400: "입력값을 다시 확인해주세요.",
  401: "로그인이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 정보를 찾을 수 없습니다.",
  409: "이미 처리된 정보가 있습니다.",
};

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export const isBadRequest = (error) =>
  error?.status === HTTP_STATUS.BAD_REQUEST;
export const isUnauthorized = (error) =>
  error?.status === HTTP_STATUS.UNAUTHORIZED;
export const isForbidden = (error) => error?.status === HTTP_STATUS.FORBIDDEN;
export const isNotFound = (error) => error?.status === HTTP_STATUS.NOT_FOUND;

export const getApiErrorCode = (error) =>
  error.code || error.body?.code || error.body?.message || error.message;

export const getApiErrorMessage = (
  error,
  fallbackMessage = "요청에 실패했습니다."
) => {
  if (STATUS_ERROR_MESSAGE[error.status]) {
    return STATUS_ERROR_MESSAGE[error.status];
  }

  if (error.status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return fallbackMessage;
};
