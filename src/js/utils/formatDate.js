// 서버 날짜(ISO 등)를 "YYYY-MM-DD HH:mm:ss" 형태로 변환한다.
export const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return String(date).replace("T", " ").slice(0, 19);
};
