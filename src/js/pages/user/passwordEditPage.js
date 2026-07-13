import { updatePassword } from "../../api/userApi.js";
import { API_ERROR_CODE } from "../../api/errors.js";
import { clearFieldHelpers } from "../../utils/clearFieldHelpers.js";
import { handleFormError } from "../../utils/handleFormError.js";
import { setFieldHelper } from "../../utils/setFieldHelper.js";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,20}$/;

export const initPasswordEditPage = () => {
  const form = document.querySelector(".password-edit-form");

  if (!form) {
    return;
  }

  form.addEventListener("input", () => {
    clearFieldHelpers(".password-edit-form");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldHelpers(".password-edit-form");

    const currentPassword =
      form.querySelector("#current-password")?.value || "";
    const newPassword = form.querySelector("#new-password")?.value || "";
    const passwordConfirm =
      form.querySelector("#password-confirm")?.value || "";

    if (!currentPassword) {
      setFieldHelper("#current-password", "현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!PASSWORD_PATTERN.test(newPassword)) {
      setFieldHelper(
        "#new-password",
        "비밀번호는 영문 대·소문자, 숫자, 특수문자를 포함한 8~20자여야 합니다."
      );
      return;
    }

    if (newPassword !== passwordConfirm) {
      setFieldHelper("#password-confirm", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword });
      form.reset();
      alert("비밀번호가 수정되었습니다.");
    } catch (error) {
      handleFormError(error, {
        fieldSelectors: {
          currentPassword: "#current-password",
          newPassword: "#new-password",
        },
        fieldErrors: [
          {
            code: API_ERROR_CODE.INVALID_CREDENTIALS,
            selector: "#current-password",
            message: "현재 비밀번호가 일치하지 않습니다.",
          },
          {
            code: API_ERROR_CODE.SAME_AS_CURRENT_PASSWORD,
            selector: "#new-password",
            message: "현재 비밀번호와 다른 비밀번호를 입력해주세요.",
          },
          {
            status: 400,
            selector: "#new-password",
            message: "비밀번호를 다시 확인해주세요.",
          },
        ],
        logLabel: "비밀번호 수정 실패",
        fallbackMessage: "비밀번호 수정에 실패했습니다.",
      });
    }
  });
};
