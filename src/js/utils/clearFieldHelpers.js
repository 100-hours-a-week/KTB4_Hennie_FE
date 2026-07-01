// 폼 안의 모든 헬퍼 텍스트(.field__helper)를 비운다.
// 재검증 전(폼 제출 시점)에 이전 에러 메시지를 초기화하는 용도.
export const clearFieldHelpers = (formSelector) => {
  document
    .querySelectorAll(`${formSelector} .field__helper`)
    .forEach((helper) => {
      helper.textContent = "";
    });
};
