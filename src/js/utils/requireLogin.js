import { hasAccessToken } from "../store/tokenStore.js";

// 로그인 상태가 아니면 alert를 띄우고 false를 반환한다.
// 로그인 필요한 액션 앞단에서 가드로 사용.
export const requireLogin = (message = "로그인이 필요합니다.") => {
  if (hasAccessToken()) {
    return true;
  }

  alert(message);
  history.pushState(null, "", "/users/login");
  window.dispatchEvent(new CustomEvent("app:navigate"));
  return false;
};
