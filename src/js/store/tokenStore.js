let accessToken = null;
let accessTokenExpiresAt = 0;
let currentUser = null;

const REFRESH_MARGIN_MS = 60 * 1000;

// 액세스 토큰 및 유효기간 관리
export const setAccessToken = ({ token, expiresIn }) => {
  accessToken = token;
  accessTokenExpiresAt = getExpiresAt(expiresIn);
  currentUser = currentUser || getUserFromAccessToken(token);

  //   console.log("accessToken", accessToken);
  //   console.log("accessTokenExpiresAt", accessTokenExpiresAt);
};

export const clearAccessToken = () => {
  accessToken = null;
  accessTokenExpiresAt = 0;
  currentUser = null;
};

export const getAccessToken = () => accessToken;

export const getCurrentUser = () =>
  currentUser ?? getUserFromAccessToken(accessToken);

export const setCurrentUser = (user) => {
  if (!user) {
    currentUser = null;
    return;
  }

  currentUser = {
    ...(getUserFromAccessToken(accessToken) || {}),
    ...(currentUser || {}),
    ...user,
  };
};

export const getCurrentUserId = () => getCurrentUser()?.id;

// 추후에 ID 기반으로 수정하고싶음 - 회원정보 수정으로 닉네임 수정 시 연관됨. 그리고 댓글 응답 데이터에 닉네임만 전달됨. 현재는 고유 닉네임이라서 별 문제 없음.
export const getCurrentUserNickname = () => getCurrentUser()?.nickname;

export const hasAccessToken = () => Boolean(accessToken);

export const shouldRefreshAccessToken = () => {
  if (!accessToken || !accessTokenExpiresAt) {
    return false;
  }

  return Date.now() >= accessTokenExpiresAt - REFRESH_MARGIN_MS;
};

const getExpiresAt = (expiresIn) => {
  const duration = Number(expiresIn);

  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  return Date.now() + (duration > 86400 ? duration : duration * 1000);
};

const getUserFromAccessToken = (token) => {
  const payload = parseJwtPayload(token);

  if (!payload?.sub) {
    return null;
  }

  return {
    id: Number(payload.sub),
    email: payload.email,
    nickname: payload.nickname,
  };
};

const parseJwtPayload = (token) => {
  try {
    const payload = token?.split(".")[1];

    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};
