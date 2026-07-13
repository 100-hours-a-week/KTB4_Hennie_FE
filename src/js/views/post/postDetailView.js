import { escapeHtml } from "../../utils/escapeHtml.js";
import { formatDate } from "../../utils/formatDate.js";
import { isOwnedByCurrentUser } from "../../utils/isOwnedByCurrentUser.js";

const DEFAULT_PROFILE = "/src/assets/images/profile-default.jpeg";

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

    <p class="post-detail-body">${content}</p>

    <div class="stat-boxes">
      <button
        type="button"
        class="stat-box stat-box--like${liked ? " is-liked" : ""}"
        id="postLikeButton"
        aria-pressed="${liked}"
        aria-label="좋아요${liked ? " 취소" : ""}"
      >
        <span class="stat-box__count" id="postLikeCount">${likeCount}</span>
        <span class="stat-box__label">좋아요수</span>
      </button>
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
