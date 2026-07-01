// 회원정보 수정(프로필 편집) 페이지의 DOM 읽기/쓰기를 담당하는 view 계층

// 폼 입력값 수집
export const getProfileEditFormValues = () => ({
  nickname: document.querySelector("#nickname")?.value.trim() || "",
  profileUrl:
    document.querySelector("#profile-url")?.value.trim() ||
    document.querySelector("[name='profileUrl']")?.value.trim() ||
    "",
});

// 회원 정보를 화면(입력 필드 / 프로필 이미지)에 채워넣기
export const renderMyInfo = (user) => {
  const emailInput = document.querySelector("#email");
  const nicknameInput = document.querySelector("#nickname");
  const profileImages = document.querySelectorAll(
    ".header__profile-btn img, .avatar-upload__preview"
  );

  if (emailInput) {
    emailInput.value = user.email || "";
  }

  if (nicknameInput) {
    nicknameInput.value = user.nickname || "";
  }

  if (user.profileUrl) {
    profileImages.forEach((image) => {
      image.src = user.profileUrl;
    });
  }
};
