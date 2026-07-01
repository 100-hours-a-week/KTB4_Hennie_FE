import { escapeHtml } from "../utils/escapeHtml.js";
import { formatDate } from "../utils/formatDate.js";

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
        <h2 class="post-card__title">${title}</h2>
        <div class="post-card__meta">
          <div class="post-card__stats">
            <span>좋아요 ${likeCount}</span>
            <span>댓글 ${commentCount}</span>
            <span>조회수 ${viewCount}</span>
          </div>
          <time class="post-card__date">${createdAt}</time>
        </div>
        <div class="post-card__author">
          <span class="post-card__author-avatar">
            <img src="${profileUrl}" alt="작성자" />
          </span>
          <span class="post-card__author-name">${authorName}</span>
        </div>
      </a>
    </li>`;
};
