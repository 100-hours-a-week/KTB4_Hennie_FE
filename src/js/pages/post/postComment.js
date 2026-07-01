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

// 게시글 상세 페이지의 댓글 기능 연결
export const initPostComment = (postId) => {
  const input = document.querySelector(".comment-form__input");
  const submitButton = document.querySelector("#commentSubmitBtn");
  const commentList = document.querySelector("#commentList");

  // 변경 후 게시글을 다시 불러와 댓글 목록만 갱신 (댓글 전용 GET 없음)
  const reloadComments = async () => {
    try {
      const response = await getPost(postId);
      const post = response.data || response;
      const comments = extractComments(post);

      renderCommentList(comments);
      setCommentCount(post.commentCount ?? comments.length);
    } catch (error) {
      handleApiError(error, {
        logLabel: "댓글 목록 조회 실패",
        fallbackMessage: "댓글을 불러오지 못했습니다.",
        onNotFound: () => alert("게시글을 찾을 수 없습니다."),
      });
    }
  };

  // 댓글 작성
  submitButton?.addEventListener("click", async () => {
    const content = input?.value.trim() || "";

    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await createComment(postId, { content });
      input.value = "";
      await reloadComments();
    } catch (error) {
      handleApiError(error, {
        logLabel: "댓글 작성 실패",
        fallbackMessage: "댓글 작성에 실패했습니다.",
        forbiddenMessage: "댓글을 작성할 권한이 없습니다.",
        onNotFound: () => alert("게시글을 찾을 수 없습니다."),
      });
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
      editComment(postId, commentId, item, reloadComments);
      return;
    }

    if (event.target.closest(".comment-item__delete")) {
      removeComment(postId, commentId, reloadComments);
    }
  });
};

const editComment = async (postId, commentId, item, reloadComments) => {
  const current =
    item.querySelector(".comment-item__body")?.textContent.trim() || "";
  const input = prompt("댓글을 수정하세요.", current);

  if (input === null) {
    return; // 취소
  }

  const content = input.trim();

  if (!content) {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  try {
    await updateComment(postId, commentId, { content });
    await reloadComments();
  } catch (error) {
    handleApiError(error, {
      logLabel: "댓글 수정 실패",
      fallbackMessage: "댓글 수정에 실패했습니다.",
      forbiddenMessage: "댓글을 수정할 권한이 없습니다.",
      onNotFound: () => alert("게시글 또는 댓글을 찾을 수 없습니다."),
    });
  }
};

const removeComment = async (postId, commentId, reloadComments) => {
  if (!confirm("댓글을 삭제하시겠습니까?")) {
    return;
  }

  try {
    await deleteComment(postId, commentId);
    await reloadComments();
  } catch (error) {
    handleApiError(error, {
      logLabel: "댓글 삭제 실패",
      fallbackMessage: "댓글 삭제에 실패했습니다.",
      forbiddenMessage: "댓글을 삭제할 권한이 없습니다.",
      onNotFound: () => alert("게시글 또는 댓글을 찾을 수 없습니다."),
    });
  }
};
