// 폼 내부의 모든 .field__toggle 버튼을 같은 .field 안의 비밀번호 인풋에 연결한다.
// 표시/숨기기 상태에 따라 input.type과 버튼 라벨을 토글한다.
export const initPasswordToggles = (formSelector) => {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.querySelectorAll(".field__toggle").forEach((toggle) => {
    const input = toggle.closest(".field")?.querySelector("input");
    if (!input) return;

    toggle.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggle.textContent = isHidden ? "숨기기" : "표시";
      toggle.setAttribute(
        "aria-label",
        isHidden ? "비밀번호 숨기기" : "비밀번호 표시"
      );
    });
  });
};
