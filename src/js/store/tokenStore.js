let accessToken = null;
let accessTokenExpiresAt = 0;
let currentUser = null;

const REFRESH_MARGIN_MS = 60 * 1000;

// 액세스 토큰 및 유효기간 관리
export const setAccessToken = ({ token, expiresIn }) => {
  accessToken = token;
  accessTokenExpiresAt = getExpiresAt(expiresIn);
  currentUser = currentUser || getUserFromAccessToken(token);
};

export const clearAccessToken = () => {
  accessToken = null;
  accessTokenExpiresAt = 0;
  currentUser = null;
};

export const getAccessToken = () => accessToken;

const getCurrentUser = () =>
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

// TODO: 게시글/댓글 응답에 작성자 ID가 추가되면 닉네임 기반 소유권 판별을 ID 기반으로 변경한다.
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
