import {
  deletePost,
  getPost,
  likePost,
  reportPost,
  unlikePost,
} from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { renderPostDetail } from "../../views/post/postDetailView.js";
import {
  extractComments,
  renderCommentList,
} from "../../views/comment/commentView.js";
import { openModal, closeModal } from "../../utils/modal.js";
import { requireLogin } from "../../utils/requireLogin.js";
import { initPostComment } from "./postComment.js";
import {
  getCurrentUserId,
  getCurrentUserNickname,
} from "../../store/tokenStore.js";

// 게시글 상세 페이지 컨트롤러
export const initPostDetailPage = async (postId) => {
  try {
    const response = await getPost(postId);
    const post = response.data || response;

    const currentUserId = getCurrentUserId();
    const currentUserNickname = getCurrentUserNickname();

    renderPostDetail(post, { currentUserId, currentUserNickname });
    renderCommentList(extractComments(post), {
      currentUserId,
      currentUserNickname,
    });
  } catch (error) {
    handleApiError(error, {
      logLabel: "게시글 조회 실패",
      fallbackMessage: "게시글을 불러오지 못했습니다.",
    });
    return;
  }

  bindEditLink(postId);
  bindDeleteButton(postId);
  bindLikeButton(postId);
  bindReportButton(postId);
  initPostComment(postId, {
    currentUserId: getCurrentUserId(),
    currentUserNickname: getCurrentUserNickname(),
  }); // 댓글 작성/수정/삭제
};

const bindReportButton = (postId) => {
  const reportButton = document.querySelector("#postReportBtn");
  const reportModal = document.querySelector("#postReportModal");
  const reasonInput = document.querySelector("#postReportReason");
  const cancelButton = document.querySelector("#postReportCancel");
  const confirmButton = document.querySelector("#postReportConfirm");

  if (
    !reportButton ||
    !reportModal ||
    !reasonInput ||
    !cancelButton ||
    !confirmButton
  ) {
    return;
  }

  const closeReportModal = () => {
    closeModal(reportModal);
    reasonInput.value = "";
  };

  reportButton.addEventListener("click", () => {
    if (!requireLogin()) {
      return;
    }

    openModal(reportModal);
    reasonInput.focus();
  });

  cancelButton.addEventListener("click", closeReportModal);

  reportModal.addEventListener("click", (event) => {
    if (event.target === reportModal) {
      closeReportModal();
    }
  });

  confirmButton.addEventListener("click", async () => {
    const reason = reasonInput.value.trim();

    if (!reason) {
      alert("신고 사유를 입력해주세요.");
      reasonInput.focus();
      return;
    }

    try {
      confirmButton.disabled = true;
      const response = await reportPost(postId, { reason });

      console.log("게시글 신고 응답", response);
      closeReportModal();
      alert("게시글이 신고되었습니다.");
    } catch (error) {
      handleApiError(error, {
        logLabel: "게시글 신고 실패",
        fallbackMessage: "게시글 신고에 실패했습니다.",
        forbiddenMessage: "본인의 게시글은 신고할 수 없습니다.",
        onNotFound: () => alert("게시글을 찾을 수 없습니다."),
      });
    } finally {
      confirmButton.disabled = false;
    }
  });
};

const bindLikeButton = (postId) => {
  const likeButton = document.querySelector("#postLikeButton");
  const likeCount = document.querySelector("#postLikeCount");

  if (!likeButton || !likeCount) {
    return;
  }

  likeButton.addEventListener("click", async () => {
    const wasLiked = likeButton.getAttribute("aria-pressed") === "true";
    const previousCount = Number(likeCount.textContent) || 0;

    setLikeButtonState(likeButton, likeCount, {
      liked: !wasLiked,
      count: Math.max(0, previousCount + (wasLiked ? -1 : 1)),
    });
    likeButton.disabled = true;

    try {
      if (wasLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      setLikeButtonState(likeButton, likeCount, {
        liked: wasLiked,
        count: previousCount,
      });
      handleApiError(error, {
        logLabel: wasLiked ? "좋아요 취소 실패" : "좋아요 등록 실패",
        fallbackMessage: wasLiked
          ? "좋아요 취소에 실패했습니다."
          : "좋아요 등록에 실패했습니다.",
        onNotFound: () => alert("게시글을 찾을 수 없습니다."),
      });
    } finally {
      likeButton.disabled = false;
    }
  });
};

const setLikeButtonState = (button, countElement, { liked, count }) => {
  button.classList.toggle("is-liked", liked);
  button.setAttribute("aria-pressed", String(liked));
  button.setAttribute("aria-label", liked ? "좋아요 취소" : "좋아요");
  countElement.textContent = String(count);
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
