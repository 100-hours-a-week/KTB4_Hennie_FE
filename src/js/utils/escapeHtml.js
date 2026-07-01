// HTML 특수문자를 엔티티로 변환해 XSS를 막는다.
// innerHTML/템플릿 문자열에 동적 데이터를 넣기 전에 감싸서 사용한다.
export const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
