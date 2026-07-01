// 모달 열고/닫기 (UI 상태 토글). is-open 클래스로 표시 여부를 제어한다.
export const openModal = (modal) => {
  modal.classList.add("is-open");
};

export const closeModal = (modal) => {
  modal.classList.remove("is-open");
};
