import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'

export const getNotificationErrorMessage = (error, fallback) =>
  getHttpErrorMessage(error, {
    network: fallback,
    unauthorized: '로그인 정보가 만료됐어요. 다시 로그인해주세요.',
    forbidden: '이 알림을 확인할 수 없어요.',
    notFound: '알림을 찾을 수 없어요. 목록을 새로고침해주세요.',
    serverError:
      '알림을 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.',
    fallback: '알림 목록을 불러오지 못했습니다.',
  })
