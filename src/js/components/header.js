import { hasAccessToken } from "../store/tokenStore.js";

// 공통 헤더 컴포넌트. 왼쪽 상단 로고 + (옵션) 프로필 메뉴.
export const Header = ({ profile = false } = {}) => `
    <header class="header">
      ${renderLogo()}
      ${profile ? renderProfileMenu() : ""}
    </header>`;

// 로그인/회원가입에서는 로고를 링크 없이 노출하고,
// 그 외 모든 페이지에서는 게시글 목록(/posts)으로 이동하는 링크로 감싼다.
const renderLogo = () => {
  const image = `<img
          class="header__logo-img"
          src="/src/assets/images/logo.png"
          alt="개발바닥"
        />`;

  if (location.pathname === "/users/signup") {
    return `<span class="header__logo">${image}</span>`;
  }

  return `<a class="header__logo" href="/posts" aria-label="개발바닥 홈">${image}</a>`;
};

// 프로필 아이콘 + 드롭다운 메뉴. 토글 동작은 headerMenu.js(전역 위임)가 담당.
const renderProfileMenu = () => `
      <div class="header__profile">
        <button
          type="button"
          class="header__profile-btn"
          id="profileMenuBtn"
          aria-label="프로필 메뉴"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="profileMenu"
        >
          <img src="/src/assets/images/profile-default.jpeg" alt="프로필" />
        </button>
        <nav class="header__menu" id="profileMenu">
          ${renderProfileMenuItems()}
        </nav>
      </div>`;

const renderProfileMenuItems = () => {
  if (!hasAccessToken()) {
    return '<a class="header__menu-item" href="/users/login">로그인</a>';
  }

  return `
          <a class="header__menu-item" href="/users/myInfo">회원정보 수정</a>
          <a class="header__menu-item" href="/users/myInfo/password">비밀번호 수정</a>
          <button type="button" class="header__menu-item" id="logoutBtn">
            로그아웃
          </button>`;
};
