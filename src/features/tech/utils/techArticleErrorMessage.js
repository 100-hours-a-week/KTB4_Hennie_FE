const TECH_ARTICLE_ERROR_MESSAGES = {
  invalidEnterprise: '지원하지 않는 기업입니다.',
  invalidPageParameter: '잘못된 페이지 요청입니다.',
}

export const getTechArticleErrorMessage = (error) =>
  TECH_ARTICLE_ERROR_MESSAGES[error?.code] ||
  '기술 원문 목록을 불러오지 못했습니다.'
