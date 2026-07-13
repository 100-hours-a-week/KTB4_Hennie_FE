import { escapeHtml } from "../../utils/escapeHtml.js";
import { formatDate } from "../../utils/formatDate.js";
import { isOwnedByCurrentUser } from "../../utils/isOwnedByCurrentUser.js";

const DEFAULT_PROFILE = "/src/assets/images/profile-default.jpeg";

// 통계 아이콘 (velopers 스타일: 아이콘 + 숫자)
const ICON_LIKE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ICON_COMMENT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const ICON_VIEW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

// 댓글 수 통계만 갱신 (댓글 작성/삭제 후 즉시 반영용)
export const setCommentCount = (count) => {
  const element = document.querySelector("#commentCount");

  if (element) {
    element.textContent = count;
  }
};

// 게시글 상세 본문 마크업을 생성해 #postDetail 컨테이너에 렌더한다.
export const renderPostDetail = (
  post,
  { currentUserId, currentUserNickname } = {}
) => {
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
  const liked = Boolean(post.liked);
  const viewCount = post.viewCount ?? post.views ?? 0;
  const commentCount = post.commentCount ?? post.comments ?? 0;
  const canManagePost = isOwnedByCurrentUser(post, {
    id: currentUserId,
    nickname: currentUserNickname,
  });

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
      ${canManagePost ? `
        <a class="btn btn--secondary btn--sm" id="postEditLink">수정</a>
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          id="postDeleteBtn"
        >
          삭제
        </button>
      ` : `
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          id="postReportBtn"
        >
          신고
        </button>
      `}
      </div>
    </div>

    ${
      imageUrl
        ? `<img class="post-detail-image" src="${escapeHtml(
            imageUrl
          )}" alt="${title}" />`
        : ""
    }

    <p class="post-detail-body">${content}</p>`;

  // 통계 아이콘 행을 댓글 입력 폼 위(#postStats)에 렌더한다.
  const $stats = document.querySelector("#postStats");

  if ($stats) {
    $stats.innerHTML = `
      <button
        type="button"
        class="post-detail-stat post-detail-stat--like${
          liked ? " is-liked" : ""
        }"
        id="postLikeButton"
        aria-pressed="${liked}"
        aria-label="좋아요${liked ? " 취소" : ""}"
      >
        ${ICON_LIKE}<span id="postLikeCount">${likeCount}</span>
      </button>
      <span class="post-detail-stat" aria-label="댓글 ${commentCount}">
        ${ICON_COMMENT}<span id="commentCount">${commentCount}</span>
      </span>
      <span class="post-detail-stat" aria-label="조회수 ${viewCount}">
        ${ICON_VIEW}<span>${viewCount}</span>
      </span>`;
  }
};
