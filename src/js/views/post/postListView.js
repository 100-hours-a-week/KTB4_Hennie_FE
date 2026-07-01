import { PostCard } from "../../components/postCard.js";

export const renderPostList = (posts, { append = false } = {}) => {
  const postList = document.querySelector("#postList"); // html에서 해당 컨테이너 부분 가져옴

  if (!postList) {
    return;
  }

  if (!append && posts.length === 0) {
    postList.innerHTML = `<li class="post-list__empty">게시글이 존재하지 않습니다.</li>`;
    return;
  }

  if (append && posts.length === 0) {
    return;
  }

  const postListHtml = posts.map((post) => PostCard(post)).join("");

  if (append) {
    postList.insertAdjacentHTML("beforeend", postListHtml);
    return;
  }

  postList.innerHTML = postListHtml;
};

export const getPostListSentinel = () =>
  document.querySelector("#postListSentinel"); // html에서 해당 컨테이너 부분 가져옴

export const setPostListStatus = (message = "") => {
  const sentinel = getPostListSentinel(); // 상태 문구 표시용

  if (sentinel) {
    sentinel.textContent = message;
  }
};
