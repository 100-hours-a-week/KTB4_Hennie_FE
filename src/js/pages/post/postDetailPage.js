import { getPost, deletePost } from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { renderPostDetail } from "../../views/post/postDetailView.js";
import {
  extractComments,
  renderCommentList,
} from "../../views/comment/commentView.js";
import { openModal, closeModal } from "../../utils/modal.js";
import { initPostComment } from "./postComment.js";

// 게시글 상세 페이지 컨트롤러
export const initPostDetailPage = async (postId) => {
  try {
    const response = await getPost(postId);
    const post = response.data || response;

    renderPostDetail(post);
    renderCommentList(extractComments(post));
  } catch (error) {
    handleApiError(error, {
      logLabel: "게시글 조회 실패",
      fallbackMessage: "게시글을 불러오지 못했습니다.",
    });
    return;
  }

  bindEditLink(postId);
  bindDeleteButton(postId);
  initPostComment(postId); // 댓글 작성/수정/삭제
};

// 상세 → 수정 페이지로 이동 (SPA 링크 라우터가 처리)
const bindEditLink = (postId) => {
  const editLink = document.querySelector("#postEditLink");

  if (editLink) {
    editLink.href = `/posts/${postId}/edit`;
  }
};

// 삭제 → 확인 모달 → DELETE /posts/:id
const bindDeleteButton = (postId) => {
  const deleteButton = document.querySelector("#postDeleteBtn");
  const modal = document.querySelector("#deleteModal");
  const cancelButton = document.querySelector("#deleteCancel");
  const confirmButton = document.querySelector("#deleteConfirm");

  if (!deleteButton || !modal || !cancelButton || !confirmButton) {
    return;
  }

  deleteButton.addEventListener("click", () => {
    openModal(modal);
  });

  cancelButton.addEventListener("click", () => {
    closeModal(modal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });

  confirmButton.addEventListener("click", async () => {
    try {
      await deletePost(postId);

      alert("게시글이 삭제되었습니다.");
      closeModal(modal);
      history.pushState(null, "", "/posts"); // 삭제 후 목록으로 이동
      window.dispatchEvent(new CustomEvent("app:navigate"));
    } catch (error) {
      handleApiError(error, {
        logLabel: "게시글 삭제 실패",
        fallbackMessage: "게시글 삭제에 실패했습니다.",
      });
    }
  });
};
