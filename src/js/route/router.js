import { routes, FALLBACK_ROUTE } from "./routes.js";

const PAGE_BASE = "/src/pages";

// 현재 경로에 맞는 라우트와 캡처된 파라미터(정규식 그룹)를 찾는다.
export const matchRoute = (pathname) => {
  for (const route of routes) {
    if (typeof route.path === "string") {
      if (route.path === pathname) {
        return { route, params: [] };
      }
      continue;
    }

    const matched = pathname.match(route.path);
    if (matched) {
      return { route, params: matched.slice(1) };
    }
  }

  return { route: FALLBACK_ROUTE, params: [] };
};

// 라우트의 view(html)를 불러와 title/body로 파싱한다.
export const loadView = async (view) => {
  const response = await fetch(`${PAGE_BASE}/${view}`);

  if (!response.ok) {
    throw new Error(`Failed to load page: ${view}`);
  }

  const html = await response.text();
  const parsedDocument = new DOMParser().parseFromString(html, "text/html");

  return {
    title: parsedDocument.title,
    body: parsedDocument.body.innerHTML,
  };
};

export const getInternalLink = (event) => {
  const link = event.target.closest("a");

  if (!link || link.origin !== location.origin) {
    return null;
  }

  return link;
};
