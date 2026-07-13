import { del, get, patch, post } from "./client.js";

// 회원가입
export const signup = ({ email, password, nickname, profileUrl }) =>
  post(
    "/users/signup",
    {
      email,
      password,
      nickname,
      ...(profileUrl ? { profileUrl } : {}),
    },
    {
      auth: false,
      skipAuthRefresh: true,
    }
  );

// 회원정보 조회
export const getMyInfo = () =>
  get("/users/myInfo", {
    auth: true,
  });

// 회원정보 수정
export const updateMyInfo = ({ nickname, profileUrl }) =>
  patch(
    `/users/myInfo`,
    {
      nickname,
      ...(profileUrl ? { profileUrl } : {}),
    },
    {
      auth: true,
    }
  );

// 비밀번호 수정
export const updatePassword = ({ currentPassword, newPassword }) =>
  patch(
    "/users/password",
    { currentPassword, newPassword },
    {
      auth: true,
    }
  );

// 회원 탈퇴
export const withdrawMyInfo = () =>
  del(`/users/myInfo`, {
    auth: true,
  });
