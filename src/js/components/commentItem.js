import { escapeHtml } from "../utils/escapeHtml.js";
import { formatDate } from "../utils/formatDate.js";

export const CommentItem = (comment) => {
  const commentId = comment.id || comment.commentId || "";
  const isDeleted = Boolean(comment.deleted);
  const authorName = escapeHtml(
    comment.authorNickname ||
      comment.nickname ||
      comment.author?.nickname ||
      "익명"
  );
  const profileUrl = escapeHtml(
    comment.authorProfileUrl ||
      comment.profileUrl ||
      comment.author?.profileUrl ||
      "/src/assets/images/profile-default.jpeg"
  );
  const createdAt = escapeHtml(
    formatDate(comment.createdAt || comment.modifiedAt)
  );
  const isEdited = Boolean(comment.edited);
  const content = escapeHtml(comment.content || comment.comment || "");

  return `
    <li class="comment-item" data-comment-id="${escapeHtml(String(commentId))}">
      <div class="comment-item__head">
        <div class="comment-item__author">
          <span class="comment-item__avatar">
            <img src="${profileUrl}" alt="작성자" />
          </span>
          <span class="comment-item__name">${authorName}</span>
          <span class="comment-item__date">${createdAt}</span>
          ${
            isEdited ? '<span class="comment-item__edited">(수정됨)</span>' : ""
          }
        </div>
        ${
          isDeleted
            ? ""
            : `<div class="comment-item__actions">
          <button type="button" class="btn btn--secondary btn--sm comment-item__edit">
            수정
          </button>
          <button type="button" class="btn btn--secondary btn--sm comment-item__delete">
            삭제
          </button>
        </div>`
        }
      </div>
      <p class="comment-item__body">${content}</p>
    </li>`;
};
