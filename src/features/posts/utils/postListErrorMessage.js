import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'

// 게시글 목록 조회 실패 메시지 매핑 (usePostList 전용)
const getPostListErrorMessage = (error) =>
  getHttpErrorMessage(error, {
    unauthorized: '로그인이 만료됐습니다. 다시 로그인해주세요.',
    fallback: '게시글 목록을 불러오지 못했습니다.',
  })

export default getPostListErrorMessage
