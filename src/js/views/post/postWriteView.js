import { escapeHtml } from "../../utils/escapeHtml.js";
import { formatDate } from "../../utils/formatDate.js";

export const getPostWriteFormValues = () => ({
  title: document.querySelector("#title")?.value.trim() || "",
  content: document.querySelector("#content")?.value.trim() || "",
  imageUrl:
    document.querySelector("#image-url")?.value.trim() ||
    document.querySelector("[name='imageUrl']")?.value.trim() ||
    "",
});

const isPostWriteFormFilled = () => {
  const { title, content } = getPostWriteFormValues();

  return Boolean(title && content);
};

export const fillPostWriteForm = (post) => {
  const titleInput = document.querySelector("#title");
  const contentInput = document.querySelector("#content");

  if (titleInput) {
    titleInput.value = post.title || "";
  }

  if (contentInput) {
    contentInput.value = post.content || "";
  }
};

export const setPostSubmitButtonReady = (isReady) => {
  const submitButton = document.querySelector(".post-write-form .btn--primary");

  submitButton?.classList.toggle("post-write-submit--ready", isReady);
};

export const setSelectedFileName = (fileName) => {
  const fileNameElement = document.querySelector(".field__file-name");

  if (fileNameElement) {
    fileNameElement.textContent = fileName || "파일을 선택해주세요.";
  }
};

export const setPostWriteHelper = (message) => {
  const helper = document.querySelector(".post-write-form .field__helper");

  if (helper) {
    helper.textContent = message ? `* ${message}` : "";
  }
};

export const clearPostWriteHelper = () => {
  setPostWriteHelper("");
};

// 입력 상태에 맞춰 제출 버튼 활성화 + 헬퍼 문구를 동기화한다.
export const syncPostWriteFormState = () => {
  const isFilled = isPostWriteFormFilled();

  setPostSubmitButtonReady(isFilled);

  if (isFilled) {
    clearPostWriteHelper();
    return;
  }

  setPostWriteHelper("제목,내용을 모두 작성해주세요");
};

export const renderDraftList = (drafts) => {
  const draftList = document.querySelector("#postDraftList");

  if (!draftList) {
    return;
  }

  if (drafts.length === 0) {
    draftList.innerHTML = `<li class="post-draft-list__empty">임시 저장된 글이 없습니다.</li>`;
    return;
  }

  draftList.innerHTML = drafts
    .map(
      (draft) => {
        const postId = draft.postId || draft.id;

        return `
        <li class="post-draft-list__item">
          <button
            type="button"
            class="post-draft-list__content"
            data-post-id="${postId}"
          >
            <span class="post-draft-list__title">
              ${escapeHtml(draft.title || "제목 없음")}
            </span>
            <span class="post-draft-list__date">
              ${formatDate(draft.modifiedAt || draft.createdAt)}
            </span>
          </button>
          <div class="post-draft-list__actions">
            <button
              type="button"
              class="btn post-draft-list__delete-button"
              data-post-id="${postId}"
            >
              삭제
            </button>
          </div>
        </li>`;
      }
    )
    .join("");
};
