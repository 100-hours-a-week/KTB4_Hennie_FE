import { API_ERROR_CODE } from "../../api/errors.js";
import { getMyInfo, updateMyInfo, withdrawMyInfo } from "../../api/userApi.js";
import { clearFieldHelpers } from "../../utils/clearFieldHelpers.js";
import { openModal, closeModal } from "../../utils/modal.js";
import { handleApiError } from "../../utils/handleApiError.js";
import { handleFormError } from "../../utils/handleFormError.js";
import {
  getProfileEditFormValues,
  renderMyInfo,
} from "../../views/user/profileEditView.js";
import {
  clearAccessToken,
  setCurrentUser,
} from "../../store/tokenStore.js";

// 회원정보 수정 페이지 컨트롤러
export const initProfileEditPage = async () => {
  try {
    const response = await getMyInfo();
    const user = response.data || response;

    setCurrentUser(user);
    renderMyInfo(user);
    bindMyInfoUpdateEvent();
    bindWithdrawEvent();
  } catch (error) {
    handleApiError(error, {
      logLabel: "회원정보 조회 실패",
      fallbackMessage: "회원정보를 불러오지 못했습니다.",
    });
  }
};

// 회원정보 수정
const bindMyInfoUpdateEvent = () => {
  const form = document.querySelector(".profile-edit-form");
  const completeButton = document.querySelector(".profile-edit-complete");
  let shouldNavigateToPosts = false;

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const navigateAfterUpdate = shouldNavigateToPosts;
    shouldNavigateToPosts = false;
    clearFieldHelpers(".profile-edit-form");

    const { nickname, profileUrl } = getProfileEditFormValues();

    try {
      const response = await updateMyInfo({
        nickname,
        profileUrl,
      });
      const user = response.data || response;

      setCurrentUser(user);
      renderMyInfo(user);

      if (navigateAfterUpdate) {
        history.pushState(null, "", "/posts");
        window.dispatchEvent(new CustomEvent("app:navigate"));
      } else {
        alert("회원정보가 수정되었습니다.");
      }
    } catch (error) {
      handleFormError(error, {
        fieldErrors: [
          {
            code: API_ERROR_CODE.NICKNAME_ALREADY_EXISTS,
            selector: "#nickname",
            message: "이미 사용중인 닉네임입니다.",
          },
          {
            status: 400,
            selector: "#nickname",
            message: "닉네임을 다시 확인해주세요.",
          },
        ],
        logLabel: "회원정보 수정 실패",
        fallbackMessage: "회원정보 수정에 실패했습니다.",
      });
    }
  });

  completeButton?.addEventListener("click", () => {
    shouldNavigateToPosts = true;
    form.requestSubmit();
  });
};

// 회원 탈퇴
const bindWithdrawEvent = () => {
  const withdrawButton = document.querySelector("#withdrawBtn");
  const withdrawModal = document.querySelector("#withdrawModal");
  const cancelButton = document.querySelector("#withdrawCancel");
  const confirmButton = document.querySelector("#withdrawConfirm");

  if (!withdrawButton || !withdrawModal || !cancelButton || !confirmButton) {
    return;
  }

  withdrawButton.addEventListener("click", () => {
    openModal(withdrawModal);
  });

  cancelButton.addEventListener("click", () => {
    closeModal(withdrawModal);
  });

  withdrawModal.addEventListener("click", (event) => {
    if (event.target === withdrawModal) {
      closeModal(withdrawModal);
    }
  });

  confirmButton.addEventListener("click", async () => {
    try {
      await withdrawMyInfo();
      clearAccessToken();

      alert("회원 탈퇴가 완료되었습니다.");
      closeModal(withdrawModal);
      history.pushState(null, "", "/users/login");
      window.dispatchEvent(new CustomEvent("app:navigate"));
    } catch (error) {
      handleApiError(error, {
        logLabel: "회원 탈퇴 실패",
        fallbackMessage: "회원 탈퇴에 실패했습니다.",
      });
    }
  });
};
