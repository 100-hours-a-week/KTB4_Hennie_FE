export const REPORT_REASON_OPTIONS = [
  { value: 'SPAM', label: '스팸홍보/도배글입니다.' },
  { value: 'SEXUAL_CONTENT', label: '음란물입니다.' },
  { value: 'ILLEGAL_INFORMATION', label: '불법정보를 포함하고 있습니다.' },
  { value: 'HARMFUL_TO_YOUTH', label: '청소년에게 유해한 내용입니다.' },
  { value: 'HATE_SPEECH', label: '욕설/생명경시/혐오/차별적 표현입니다.' },
  { value: 'PERSONAL_INFORMATION', label: '개인정보 노출 게시물입니다.' },
  { value: 'OFFENSIVE_EXPRESSION', label: '불쾌한 표현이 있습니다.' },
]

export const getReportReasonLabel = (reason) =>
  REPORT_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? ''

export const isReportReason = (reason) =>
  REPORT_REASON_OPTIONS.some((option) => option.value === reason)
