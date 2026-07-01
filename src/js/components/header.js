// 공통 헤더 컴포넌트. 페이지별로 뒤로가기/프로필 메뉴 노출 여부를 옵션으로 제어한다.
export const Header = ({ back = false, profile = false } = {}) => `
    <header class="header">
      ${back ? renderBackButton() : ""}
      <h1 class="header__title">아무 말 대잔치</h1>
      ${profile ? renderProfileMenu() : ""}
    </header>`;

const renderBackButton = () => `
      <button
        type="button"
        class="header__back"
        onclick="history.back()"
        aria-label="뒤로가기"
      >
        ‹
      </button>`;

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
          <a class="header__menu-item" href="/users/myInfo">회원정보 수정</a>
          <a class="header__menu-item" href="/users/myInfo/password">비밀번호 수정</a>
          <button type="button" class="header__menu-item" id="logoutBtn">
            로그아웃
          </button>
        </nav>
      </div>`;
