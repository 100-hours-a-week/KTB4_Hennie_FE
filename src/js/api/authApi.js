import { del, get, post } from "./client.js";
import {
  clearAccessToken,
  setAccessToken,
  setCurrentUser,
} from "../store/tokenStore.js";

// 로그인
export const login = ({ email, password }) =>
  post(
    "/users/login",
    {
      email,
      password,
    },
    {
      auth: false,
      skipAuthRefresh: true,
    }
  ).then((response) => {
    saveAuthToken(response);
    return response;
  });

// 액세스 토큰 재발급용
export const refreshToken = () =>
  post("/users/token/refresh", undefined, {
    auth: false,
    skipAuthRefresh: true,
  }).then((response) => {
    saveAuthToken(response);
    return response;
  });

// 새로고침 후 HttpOnly 쿠키로 메모리 인증 상태 복구
export const restoreAuthSession = async () => {
  try {
    await refreshToken();
  } catch {
    clearAccessToken();
    return false;
  }

  await restoreCurrentUser();
  return true;
};

const restoreCurrentUser = async () => {
  try {
    const response = await get("/users/myInfo", { auth: true });
    setCurrentUser(response?.data || response);
  } catch (error) {
    console.error("현재 사용자 정보 복구 실패", error);
  }
};

// 로그아웃
export const logout = async () => {
  try {
    return await post("/users/logout", undefined, {
      auth: true,
    });
  } finally {
    clearAccessToken();
  }
};

// 메모리 상에 액세스 토큰 저장
const saveAuthToken = (response) => {
  const data =
    response?.data?.token || response?.data || response?.token || response;

  const user = response?.data?.user || response?.user;

  if (user) {
    setCurrentUser(user);
  }

  setAccessToken({
    token: data?.accessToken,
    expiresIn: data?.expiresIn,
  });
};
