import { getPost } from "../../api/postApi.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../api/commentApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { setCommentCount } from "../../views/post/postDetailView.js";
import {
  extractComments,
  renderCommentList,
} from "../../views/comment/commentView.js";
import { closeModal, openModal } from "../../utils/modal.js";
import { ConfirmModal } from "../../components/confirmModal.js";

const COMMENT_MODAL_CONFIGS = [
  {
    id: "commentEditCancelModal",
    title: "수정을 취소하시겠습니까?",
    description: "수정 중인 내용은 저장되지 않습니다.",
    cancelButton: { id: "commentEditContinueBtn", label: "계속 수정" },
    confirmButton: {
      id: "commentEditCancelConfirmBtn",
      label: "수정 취소",
    },
  },
  {
    id: "commentDeleteModal",
    title: "댓글을 삭제하시겠습니까?",
    description: "삭제한 내용은 복구할 수 없습니다.",
    cancelButton: { id: "commentDeleteCancelBtn", label: "취소" },
    confirmButton: { id: "commentDeleteConfirmBtn", label: "삭제" },
  },
];

// 게시글 상세 페이지의 댓글 기능 연결
export const initPostComment = (
  postId,
  { currentUserId, currentUserNickname } = {}
) => {
  renderCommentModals();

  const input = document.querySelector(".comment-form__input");
  const submitButton = document.querySelector("#commentSubmitBtn");
  const cancelButton = document.querySelector("#commentEditCancelBtn");
  const cancelModal = document.querySelector("#commentEditCancelModal");
  const continueButton = document.querySelector("#commentEditContinueBtn");
  const cancelConfirmButton = document.querySelector(
    "#commentEditCancelConfirmBtn"
  );
  const deleteModal = document.querySelector("#commentDeleteModal");
  const deleteCancelButton = document.querySelector(
    "#commentDeleteCancelBtn"
  );
  const deleteConfirmButton = document.querySelector(
    "#commentDeleteConfirmBtn"
  );
  const commentList = document.querySelector("#commentList");
  let editingCommentId = null;
  let deletingCommentId = null;

  const resetCommentForm = () => {
    editingCommentId = null;
    input.value = "";
    submitButton.textContent = "댓글 등록";
    cancelButton.hidden = true;
  };

  const startCommentEdit = (commentId, item) => {
    editingCommentId = commentId;
    input.value =
      item.querySelector(".comment-item__body")?.textContent.trim() || "";
    submitButton.textContent = "수정 등록";
    cancelButton.hidden = false;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.closest(".comment-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // 변경 후 게시글을 다시 불러와 댓글 목록만 갱신
  const reloadComments = async () => {
    try {
      const response = await getPost(postId);
      const post = response.data || response;
      const comments = extractComments(post);

      renderCommentList(comments, { currentUserId, currentUserNickname });
      setCommentCount(post.commentCount ?? comments.length);
    } catch (error) {
      handleApiError(error, {
        logLabel: "댓글 목록 조회 실패",
        fallbackMessage: "댓글을 불러오지 못했습니다.",
        onNotFound: () => alert("게시글을 찾을 수 없습니다."),
      });
    }
  };

  cancelButton?.addEventListener("click", () => {
    if (cancelModal) {
      openModal(cancelModal);
    }
  });

  continueButton?.addEventListener("click", () => {
    if (cancelModal) {
      closeModal(cancelModal);
      input.focus();
    }
  });

  cancelConfirmButton?.addEventListener("click", () => {
    resetCommentForm();

    if (cancelModal) {
      closeModal(cancelModal);
    }
  });

  cancelModal?.addEventListener("click", (event) => {
    if (event.target === cancelModal) {
      closeModal(cancelModal);
    }
  });

  const closeCommentDeleteModal = () => {
    deletingCommentId = null;

    if (deleteModal) {
      closeModal(deleteModal);
    }
  };

  deleteCancelButton?.addEventListener("click", closeCommentDeleteModal);

  deleteModal?.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeCommentDeleteModal();
    }
  });

  deleteConfirmButton?.addEventListener("click", async () => {
    if (!deletingCommentId) {
      return;
    }

    const commentId = deletingCommentId;

    try {
      deleteConfirmButton.disabled = true;
      await deleteComment(postId, commentId);

      if (String(editingCommentId) === String(commentId)) {
        resetCommentForm();
      }

      closeCommentDeleteModal();
      await reloadComments();
    } catch (error) {
      handleApiError(error, {
        logLabel: "댓글 삭제 실패",
        fallbackMessage: "댓글 삭제에 실패했습니다.",
        forbiddenMessage: "댓글을 삭제할 권한이 없습니다.",
        onNotFound: () => alert("게시글 또는 댓글을 찾을 수 없습니다."),
      });
    } finally {
      deleteConfirmButton.disabled = false;
    }
  });

  // 댓글 작성 또는 수정 등록
  submitButton?.addEventListener("click", async () => {
    const content = input?.value.trim() || "";

    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      submitButton.disabled = true;

      if (editingCommentId) {
        await updateComment(postId, editingCommentId, { content });
      } else {
        await createComment(postId, { content });
      }

      resetCommentForm();
      await reloadComments();
    } catch (error) {
      handleApiError(error, {
        logLabel: editingCommentId ? "댓글 수정 실패" : "댓글 작성 실패",
        fallbackMessage: editingCommentId
          ? "댓글 수정에 실패했습니다."
          : "댓글 작성에 실패했습니다.",
        forbiddenMessage: editingCommentId
          ? "댓글을 수정할 권한이 없습니다."
          : "댓글을 작성할 권한이 없습니다.",
        onNotFound: () => alert("게시글 또는 댓글을 찾을 수 없습니다."),
      });
    } finally {
      submitButton.disabled = false;
    }
  });

  // 댓글 수정/삭제 (목록 위임)
  commentList?.addEventListener("click", (event) => {
    const item = event.target.closest(".comment-item");
    const commentId = item?.dataset.commentId;

    if (!commentId) {
      return;
    }

    if (event.target.closest(".comment-item__edit")) {
      startCommentEdit(commentId, item);
      return;
    }

    if (event.target.closest(".comment-item__delete")) {
      deletingCommentId = commentId;

      if (deleteModal) {
        openModal(deleteModal);
      }
    }
  });
};

const renderCommentModals = () => {
  const modalRoot = document.querySelector("#commentModalRoot");

  if (modalRoot) {
    modalRoot.innerHTML = COMMENT_MODAL_CONFIGS.map(ConfirmModal).join("");
  }
};
