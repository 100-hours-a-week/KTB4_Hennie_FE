// 게시글 수정 페이지의 DOM 읽기/쓰기 (.post-edit-form 스코프).

// 기존 게시글 데이터를 폼에 채운다.
export const fillPostEditForm = (post) => {
  const titleInput = document.querySelector("#title");
  const contentInput = document.querySelector("#content");

  if (titleInput) {
    titleInput.value = post.title || "";
  }

  if (contentInput) {
    contentInput.value = post.content || "";
  }
};

// 폼 입력값 수집
export const getPostEditFormValues = () => ({
  title: document.querySelector("#title")?.value.trim() || "",
  content: document.querySelector("#content")?.value.trim() || "",
  imageUrl:
    document.querySelector("#image-url")?.value.trim() ||
    document.querySelector("[name='imageUrl']")?.value.trim() ||
    "",
});

export const setSelectedFileName = (fileName) => {
  const fileNameElement = document.querySelector(".field__file-name");

  if (fileNameElement) {
    fileNameElement.textContent = fileName || "파일을 선택해주세요.";
  }
};

export const setPostEditHelper = (message) => {
  const helper = document.querySelector(".post-edit-form .field__helper");

  if (helper) {
    helper.textContent = message ? `* ${message}` : "";
  }
};

export const clearPostEditHelper = () => {
  setPostEditHelper("");
};
