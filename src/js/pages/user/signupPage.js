import { API_ERROR_CODE } from "../../api/errors.js";
import { signup } from "../../api/userApi.js";
import { setFieldHelper } from "../../utils/setFieldHelper.js";
import { clearFieldHelpers } from "../../utils/clearFieldHelpers.js";
import { handleFormError } from "../../utils/handleFormError.js";
import { initPasswordToggles } from "../../utils/initPasswordToggles.js";

const SIGNUP_FIELD_SELECTOR = {
  email: "#email",
  password: "#password",
  nickname: "#nickname",
  profileUrl: "#profile-url",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,20}$/;
const NICKNAME_MAX_LENGTH = 10;

// 회원가입 페이지 컨트롤러
export const initSignupPage = () => {
  const form = document.querySelector(".signup-form");

  if (!form) {
    return;
  }

  initPasswordToggles(".signup-form");
  syncSignupSubmitButton(form);

  form.addEventListener("input", (event) => {
    clearChangedFieldHelper(event.target);
    syncSignupSubmitButton(form);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // 새로고침 막기
    clearFieldHelpers(".signup-form");

    const signupForm = getSignupFormValues();

    if (!isSignupFormValid(signupForm)) {
      syncSignupSubmitButton(form);
      return;
    }

    try {
      await signup({
        email: signupForm.email,
        password: signupForm.password,
        nickname: signupForm.nickname,
        profileUrl: signupForm.profileUrl,
      });

      alert("회원가입에 성공했습니다.");
      history.pushState(null, "", "/users/login");
      window.dispatchEvent(new CustomEvent("app:navigate"));
    } catch (error) {
      handleFormError(error, {
        fieldSelectors: SIGNUP_FIELD_SELECTOR,
        fieldErrors: [
          {
            code: API_ERROR_CODE.EMAIL_ALREADY_EXISTS,
            selector: "#email",
            message: "이미 사용중인 이메일입니다.",
          },
          {
            code: API_ERROR_CODE.NICKNAME_ALREADY_EXISTS,
            selector: "#nickname",
            message: "이미 사용중인 닉네임입니다.",
          },
        ],
        logLabel: "회원가입 실패",
        fallbackMessage: "회원가입에 실패했습니다.",
      });
    }
  });
};

const getSignupFormValues = () => ({
  email: document.querySelector("#email")?.value.trim() || "",
  password: document.querySelector("#password")?.value || "",
  passwordConfirm: document.querySelector("#password-confirm")?.value || "",
  nickname: document.querySelector("#nickname")?.value.trim() || "",
  profileUrl:
    document.querySelector("#profile-url")?.value.trim() ||
    document.querySelector("[name='profileUrl']")?.value.trim() ||
    "",
});

const isSignupFormValid = ({ email, password, passwordConfirm, nickname }) =>
  EMAIL_PATTERN.test(email) &&
  PASSWORD_PATTERN.test(password) &&
  password === passwordConfirm &&
  isNicknameValid(nickname);

const isNicknameValid = (nickname) =>
  Boolean(nickname) &&
  nickname.length <= NICKNAME_MAX_LENGTH &&
  !/\s/.test(nickname);

const syncSignupSubmitButton = (form) => {
  const submitButton = form.querySelector("button[type='submit']");
  const signupForm = getSignupFormValues();

  if (submitButton) {
    submitButton.disabled = !isSignupFormValid(signupForm);
  }

  if (
    signupForm.password &&
    signupForm.passwordConfirm &&
    signupForm.password !== signupForm.passwordConfirm
  ) {
    setFieldHelper("#password-confirm", "비밀번호가 일치하지 않습니다.");
  }
};

const clearChangedFieldHelper = (target) => {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const helper = target.closest(".field")?.querySelector(".field__helper");

  if (helper) {
    helper.textContent = "";
  }

  if (target.id === "password") {
    setFieldHelper("#password-confirm", "");
  }
};
