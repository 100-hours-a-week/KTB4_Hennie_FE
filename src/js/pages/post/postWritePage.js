import { createPost } from "../../api/postApi.js";
import { handleApiError } from "../../utils/handleApiError.js";
import {
  clearPostWriteHelper,
  getPostWriteFormValues,
  setPostSubmitButtonReady,
  setPostWriteHelper,
  setSelectedFileName,
  syncPostWriteFormState,
} from "../../views/post/postWriteView.js";
import { initPostDraft } from "./postDraftPage.js";

// 게시글 작성 페이지 컨트롤러
export const initPostWritePage = () => {
  const form = document.querySelector(".post-write-form");
  const imageInput = document.querySelector("#image");
  const titleInput = document.querySelector("#title");
  const contentInput = document.querySelector("#content");

  imageInput?.addEventListener("change", () => {
    setSelectedFileName(imageInput.files[0]?.name);
  });

  if (!form) {
    return;
  }

  titleInput?.addEventListener("input", syncPostWriteFormState);
  contentInput?.addEventListener("input", syncPostWriteFormState);
  syncPostWriteFormState();

  // 임시저장 기능 (draftPostId 상태는 여기서 캡슐화)
  const draft = initPostDraft();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearPostWriteHelper();

    const { title, content, imageUrl } = getPostWriteFormValues();

    if (!title || !content) {
      setPostWriteHelper("제목,내용을 모두 작성해주세요");
      setPostSubmitButtonReady(false);
      return;
    }

    try {
      await createPost({
        postId: draft.getDraftId(),
        title,
        content,
        imageUrl,
      });

      alert("게시글이 등록되었습니다.");
      history.pushState(null, "", "/posts"); // History API 수동 연결
      window.dispatchEvent(new CustomEvent("app:navigate"));
    } catch (error) {
      handleApiError(error, {
        logLabel: "게시글 작성 실패",
        fallbackMessage: "게시글 작성에 실패했습니다.",
      });
    }
  });
};
