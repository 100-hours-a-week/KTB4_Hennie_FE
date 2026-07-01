import { escapeHtml } from "../../utils/escapeHtml.js";
import { formatDate } from "../../utils/formatDate.js";

const DEFAULT_PROFILE = "/src/assets/images/profile-default.jpeg";

// 댓글 수 통계만 갱신 (댓글 작성/삭제 후 즉시 반영용)
export const setCommentCount = (count) => {
  const element = document.querySelector("#commentCount");

  if (element) {
    element.textContent = count;
  }
};

// 현재 화면에 표시된 댓글 수 (낙관적 업데이트의 롤백 기준값)
export const getCommentCount = () => {
  const element = document.querySelector("#commentCount");

  return Number(element?.textContent) || 0;
};

// 게시글 상세 본문 마크업을 생성해 #postDetail 컨테이너에 렌더한다.
export const renderPostDetail = (post) => {
  const $root = document.querySelector("#postDetail");

  if (!$root) {
    return;
  }

  const title = escapeHtml(post.title || "제목 없음");
  const authorName = escapeHtml(
    post.authorNickname || post.nickname || post.author?.nickname || "익명"
  );
  const profileUrl = escapeHtml(
    post.authorProfileUrl ||
      post.profileUrl ||
      post.author?.profileUrl ||
      DEFAULT_PROFILE
  );
  const createdAt = escapeHtml(formatDate(post.createdAt || post.modifiedAt));
  const isEdited = Boolean(post.edited);
  const imageUrl = post.imageUrl || post.image || "";
  const content = escapeHtml(post.content || "");
  const likeCount = post.likeCount ?? post.likes ?? 0;
  const viewCount = post.viewCount ?? post.views ?? 0;
  const commentCount = post.commentCount ?? post.comments ?? 0;

  $root.innerHTML = `
    <div class="post-detail-head">
      <div>
        <h2 class="post-detail-head__title">${title}</h2>
        <div class="post-detail-head__author">
          <span class="post-detail-head__avatar">
            <img src="${profileUrl}" alt="작성자" />
          </span>
          <span>${authorName}</span>
          <span>${createdAt}</span>
          ${
            isEdited
              ? '<span class="post-detail-head__edited">(수정됨)</span>'
              : ""
          }
        </div>
      </div>
      <div class="post-detail-head__actions">
        <a class="btn btn--secondary btn--sm" id="postEditLink">수정</a>
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          id="postDeleteBtn"
        >
          삭제
        </button>
      </div>
    </div>

    ${
      imageUrl
        ? `<img class="post-detail-image" src="${escapeHtml(
            imageUrl
          )}" alt="${title}" />`
        : ""
    }

    <p class="post-detail-body">${content}</p>

    <div class="stat-boxes">
      <div class="stat-box">
        <span class="stat-box__count">${likeCount}</span>
        <span class="stat-box__label">좋아요수</span>
      </div>
      <div class="stat-box">
        <span class="stat-box__count">${viewCount}</span>
        <span class="stat-box__label">조회수</span>
      </div>
      <div class="stat-box">
        <span class="stat-box__count" id="commentCount">${commentCount}</span>
        <span class="stat-box__label">댓글</span>
      </div>
    </div>`;
};
