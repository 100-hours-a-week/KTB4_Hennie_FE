import { logout } from "../api/authApi";

// 헤더 프로필 드롭다운 토글 + 로그아웃.
// 문서 전역 위임이라 페이지가 다시 그려져도 한 번만 등록하면 계속 동작한다.
export const initHeaderMenu = () => {
  document.addEventListener("click", (event) => {
    const menu = document.querySelector("#profileMenu");

    if (!menu) {
      return;
    }

    // 로그아웃
    if (event.target.closest("#logoutBtn")) {
      closeMenu(menu);
      handleLogout();
    }

    // 프로필 버튼 → 메뉴 토글
    const toggleButton = event.target.closest("#profileMenuBtn");

    if (toggleButton) {
      const isOpen = menu.classList.toggle("is-open");
      toggleButton.setAttribute("aria-expanded", String(isOpen));
      return;
    }

    // 메뉴 바깥 클릭 → 닫기
    if (!event.target.closest("#profileMenu")) {
      closeMenu(menu);
    }
  });
};

const closeMenu = (menu) => {
  menu.classList.remove("is-open");
  document
    .querySelector("#profileMenuBtn")
    ?.setAttribute("aria-expanded", "false");
};

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("로그아웃 실패", error);
  } finally {
    history.pushState(null, "", "/users/login");
    window.dispatchEvent(new CustomEvent("app:navigate"));
  }
};
