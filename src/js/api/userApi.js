import { del, get, patch, post } from "./client.js";

// 회원가입
export const signup = ({ email, password, nickname, profileUrl }) =>
  post("/users/signup", {
    email,
    password,
    nickname,
    ...(profileUrl ? { profileUrl } : {}),
  });

// 로그인
export const login = () => {};

// 로그아웃
export const logout = () => {};

// 회원정보 조회
export const getMyInfo = (userId) => get(`/users/${userId}`);

// 회원정보 수정
export const updateMyInfo = ({ userId = 1, nickname, profileUrl }) =>
  patch(`/users/${userId}`, {
    nickname,
    ...(profileUrl ? { profileUrl } : {}),
  });

// 비밀번호 수정
export const updatePassword = () => {};

// 회원 탈퇴
export const withdrawMyInfo = (userId) => del(`/users/${userId}`);
