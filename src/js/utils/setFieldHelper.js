// 특정 입력 필드의 헬퍼 텍스트(.field__helper)에 메시지를 표시한다.
// selector로 input을 찾아 가장 가까운 .field 안의 헬퍼를 갱신한다.
export const setFieldHelper = (selector, message) => {
  const input = document.querySelector(selector);
  const helper = input?.closest(".field")?.querySelector(".field__helper");

  if (helper) {
    const messages = Array.isArray(message)
      ? message
      : String(message || "").split("\n");

    helper.textContent = messages
      .filter(Boolean)
      .map((text) => `* ${text}`)
      .join("\n");
  }
};
