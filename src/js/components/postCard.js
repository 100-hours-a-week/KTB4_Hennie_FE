import { escapeHtml } from "../utils/escapeHtml.js";
import { formatDate } from "../utils/formatDate.js";

// 통계 아이콘 (velopers 스타일: 아이콘 + 숫자)
const ICON_LIKE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ICON_COMMENT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const ICON_VIEW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

export const PostCard = (post) => {
  const postId = post.id || post.postId;
  const title = escapeHtml(post.title || "제목 없음");
  const authorName = escapeHtml(
    post.authorNickname || post.nickname || post.author?.nickname || "익명"
  );
  const profileUrl =
    post.authorProfileUrl ||
    post.profileUrl ||
    post.author?.profileUrl ||
    "/src/assets/images/profile-default.jpeg";
  const createdAt = formatDate(post.createdAt || post.modifiedAt);
  const likeCount = post.likeCount ?? post.likes ?? 0;
  const commentCount = post.commentCount ?? post.comments ?? 0;
  const viewCount = post.viewCount ?? post.views ?? 0;

  return `
    <li>
      <a href="/posts/${postId}" class="post-card">
        <div class="post-card__header">
          <span class="post-card__author-avatar">
            <img src="${profileUrl}" alt="작성자" />
          </span>
          <span class="post-card__author-name">${authorName}</span>
        </div>
        <h2 class="post-card__title">${title}</h2>
        <div class="post-card__stats">
          <span class="post-card__stat" aria-label="좋아요 ${likeCount}">
            ${ICON_LIKE}${likeCount}
          </span>
          <span class="post-card__stat" aria-label="댓글 ${commentCount}">
            ${ICON_COMMENT}${commentCount}
          </span>
          <span class="post-card__stat" aria-label="조회수 ${viewCount}">
            ${ICON_VIEW}${viewCount}
          </span>
          <time class="post-card__date">${createdAt}</time>
        </div>
      </a>
    </li>`;
};
