import { API_ERROR_CODE, getApiErrorCode } from "../api/errors.js";
import { setFieldHelper } from "./setFieldHelper.js";
import { handleApiError } from "./handleApiError.js";

// 서버 검증 에러(error.body.data.errors[])를 각 필드 헬퍼에 반영. 하나라도 반영하면 true.
const applyServerFieldErrors = (error, fieldSelectors) => {
  const errors = error.body?.data?.errors;

  if (!Array.isArray(errors) || !fieldSelectors) {
    return false;
  }

  const reasonsByField = errors.reduce((acc, { field, reason }) => {
    if (field && reason) {
      acc[field] = [...(acc[field] || []), reason];
    }
    return acc;
  }, {});

  let applied = false;

  Object.entries(reasonsByField).forEach(([field, reasons]) => {
    const selector = fieldSelectors[field];

    if (selector) {
      setFieldHelper(selector, reasons);
      applied = true;
    }
  });

  return applied;
};

// 폼 제출 에러 처리: 필드 검증 피드백 우선, 없으면 handleApiError로 위임.
//   fieldSelectors : { 서버필드명: cssSelector } — INVALID_REQUEST 서버 검증 배열용
//   fieldErrors    : [{ code?, status?, selector, message }] — 단일 코드/상태 → 필드 매핑
//   나머지 옵션(logLabel, fallbackMessage 등)은 handleApiError로 전달.
export const handleFormError = (
  error,
  { fieldSelectors, fieldErrors = [], ...fallback } = {}
) => {
  const code = getApiErrorCode(error);

  if (
    code === API_ERROR_CODE.INVALID_REQUEST &&
    applyServerFieldErrors(error, fieldSelectors)
  ) {
    return;
  }

  const matched = fieldErrors.find(
    (rule) =>
      (rule.code !== undefined && rule.code === code) ||
      (rule.status !== undefined && rule.status === error.status)
  );

  if (matched) {
    setFieldHelper(matched.selector, matched.message);
    return;
  }

  handleApiError(error, fallback);
};
