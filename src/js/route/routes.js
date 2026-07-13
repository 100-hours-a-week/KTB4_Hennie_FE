import { initSignupPage } from "../pages/user/signupPage.js";
import { initProfileEditPage } from "../pages/user/profileEditPage.js";
import { initPasswordEditPage } from "../pages/user/passwordEditPage.js";
import { initPostListPage } from "../pages/post/postListPage.js";
import { initPostWritePage } from "../pages/post/postWritePage.js";
import { initPostDetailPage } from "../pages/post/postDetailPage.js";
import { initPostEditPage } from "../pages/post/postEditPage.js";
import { initLoginPage } from "../pages/user/loginPage.js";

// 경로 → { 화면(view), 헤더 옵션(header), 페이지 컨트롤러(init) } 단일 매핑 테이블.
// path 는 정확 매칭용 문자열 또는 동적 매칭용 정규식.
// header 미지정 시 로고만 있는 헤더가 렌더된다. (profile: 프로필 메뉴 노출)
// 정적 경로를 먼저, 동적 경로를 나중에 둔다 (배열 순서가 매칭 우선순위).
export const routes = [
  {
    path: "/",
    view: "post/post-list.html",
    header: { profile: true },
    init: initPostListPage,
  },
  { path: "/users/login", view: "user/login.html", init: initLoginPage },
  {
    path: "/users/signup",
    view: "user/signup.html",
    init: initSignupPage,
  },
  {
    path: "/users/myInfo",
    view: "user/profile-edit.html",
    header: { profile: true },
    init: initProfileEditPage,
  },
  {
    path: "/users/myInfo/password",
    view: "user/password-edit.html",
    header: { profile: true },
    init: initPasswordEditPage,
  },
  {
    path: "/posts",
    view: "post/post-list.html",
    header: { profile: true },
    init: initPostListPage,
  },
  {
    path: "/posts/write",
    view: "post/post-write.html",
    header: { profile: true },
    init: initPostWritePage,
  },
  {
    path: /^\/posts\/(\d+)\/edit$/,
    view: "post/post-edit.html",
    header: { profile: true },
    init: initPostEditPage,
  },
  {
    path: /^\/posts\/(\d+)$/,
    view: "post/post-detail.html",
    header: { profile: true },
    init: initPostDetailPage,
  },
];

// 매칭되는 라우트가 없을 때 폴백
export const FALLBACK_ROUTE = {
  view: "user/login.html",
  init: initLoginPage,
};
