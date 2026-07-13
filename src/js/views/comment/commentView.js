import { CommentItem } from "../../components/commentItem.js";
import { isOwnedByCurrentUser } from "../../utils/isOwnedByCurrentUser.js";

// 게시글 응답에서 댓글 배열을 안전하게 추출
export const extractComments = (post) => {
  const comments =
    post.comments || post.commentList || post.commentResponses || [];

  return Array.isArray(comments) ? comments : [];
};

export const renderCommentList = (
  comments = [],
  { currentUserId, currentUserNickname } = {}
) => {
  const $list = document.querySelector("#commentList");

  if (!$list) {
    return;
  }

  if (comments.length === 0) {
    $list.innerHTML = `<li class="comment-list__empty">아직 댓글이 없습니다.</li>`;
    return;
  }

  $list.innerHTML = comments
    .map((comment) =>
      CommentItem(comment, {
        canManage: isOwnedByCurrentUser(comment, {
          id: currentUserId,
          nickname: currentUserNickname,
        }),
      })
    )
    .join("");
};
