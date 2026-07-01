import { getPost, updatePost } from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import {
  fillPostEditForm,
  getPostEditFormValues,
  setSelectedFileName,
  setPostEditHelper,
  clearPostEditHelper,
} from "../../views/post/postEditView.js";

// 게시글 수정 페이지 컨트롤러
export const initPostEditPage = async (postId) => {
  const form = document.querySelector(".post-edit-form");

  if (!form) {
    return;
  }

  // 수정 전 게시글 조회
  try {
    const response = await getPost(postId);
    const post = response.data || response;

    fillPostEditForm(post);
  } catch (error) {
    handleApiError(error, {
      logLabel: "게시글 조회 실패",
      fallbackMessage: "게시글을 불러오지 못했습니다.",
    });
    return;
  }

  const imageInput = document.querySelector("#image");

  imageInput?.addEventListener("change", () => {
    setSelectedFileName(imageInput.files[0]?.name);
  });

  // 수정 이후 저장
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearPostEditHelper();

    const { title, content, imageUrl } = getPostEditFormValues();

    if (!title || !content) {
      setPostEditHelper("제목,내용을 모두 작성해주세요");
      return;
    }

    try {
      await updatePost(postId, { title, content, imageUrl });

      alert("게시글이 수정되었습니다.");
      history.pushState(null, "", `/posts/${postId}`); // 수정 후 상세로 이동
      window.dispatchEvent(new CustomEvent("app:navigate"));
    } catch (error) {
      handleApiError(error, {
        logLabel: "게시글 수정 실패",
        fallbackMessage: "게시글 수정에 실패했습니다.",
      });
    }
  });
};
