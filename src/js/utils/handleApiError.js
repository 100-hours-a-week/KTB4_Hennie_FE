import {
  getApiErrorMessage,
  isBadRequest,
  isForbidden,
  isNotFound,
  isUnauthorized,
} from "../api/errors.js";

// API 에러 공통 처리
// 상태코드별로 분기하고, 처리되지 않으면 fallbackMessage로 alert.
// 옵션으로 액션별 동작을 커스터마이징한다.
// onBadRequest : 400 처리 (없으면 기본 흐름)
// onUnauthorized : 401 처리 (기본값 = 로그인 이동)
// forbiddenMessage : 403 시 띄울 alert 문구
// onNotFound : 404 처리
// logLabel : console.error 라벨
// fallbackMessage : 그 외 상황의 alert 문구
export const handleApiError = (
  error,
  {
    logLabel,
    fallbackMessage,
    onBadRequest,
    forbiddenMessage,
    onNotFound,
    onUnauthorized = redirectToLogin,
  } = {}
) => {
  if (onBadRequest && isBadRequest(error)) {
    onBadRequest();
    return;
  }

  if (forbiddenMessage && isForbidden(error)) {
    alert(forbiddenMessage);
    return;
  }

  if (onNotFound && isNotFound(error)) {
    onNotFound();
    return;
  }

  if (isUnauthorized(error)) {
    onUnauthorized(error);
    return;
  }

  console.error(logLabel, error);
  alert(getApiErrorMessage(error, fallbackMessage));
};

// 로그인 페이지로 이동 (401 기본 처리)
const redirectToLogin = () => {
  alert("로그인이 필요합니다.");
  history.pushState(null, "", "/users/login");
  window.dispatchEvent(new CustomEvent("app:navigate"));
};
