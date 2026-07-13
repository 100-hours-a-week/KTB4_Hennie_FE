import { getInternalLink, loadView, matchRoute } from "./route/router.js";
import { Header } from "./components/header.js";
import { initHeaderMenu } from "./components/headerMenu.js";
import { registerRouteRenderer } from "./route/navigation.js";
import { restoreAuthSession } from "./api/authApi.js";

const AUTH_ENTRY_PATHS = new Set(["/","/users/login", "/users/signup"]);

const App = async ({ $target }) => {
  const route = async () => {
    const { route: matched, params } = matchRoute(location.pathname);

    try {
      const page = await loadView(matched.view);

      document.title = page.title || "개발바닥";
      $target.innerHTML = Header(matched.header) + page.body; // 헤더 + 본문

      matched.init?.(...params); // 매칭된 페이지 컨트롤러만 실행
    } catch (error) {
      console.error("페이지 로딩 실패", error);
    }
  };

  window.addEventListener("popstate", route); // 브라우저의 앞/뒤로 이동
  window.addEventListener("app:navigate", route); // 앱 내 페이지 이동
  registerRouteRenderer(route);

  // 링크 클릭 라우팅 관리
  document.addEventListener("click", (event) => {
    const link = getInternalLink(event);

    if (!link) {
      return;
    }

    event.preventDefault();
    history.pushState(null, "", link.href);
    route();
  });

  initHeaderMenu(); // 헤더 드롭다운 토글/로그아웃 (전역 1회 등록)

  if (!AUTH_ENTRY_PATHS.has(location.pathname)) {
    await restoreAuthSession();
  }

  await route();
};

export default App;
