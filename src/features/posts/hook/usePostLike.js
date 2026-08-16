import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { likePost, unlikePost } from '../api/postApi'
import { useNavigateLogin } from './useNavigateLogin'
import { POST_NOT_FOUND_MESSAGE } from '../../../shared/utils/constants'

export const usePostLike = ({ postId, liked, likeCount, onChange }) => {
  const requireLogin = useNavigateLogin()
  const { isRunning: isUpdatingLike, run } = useAsyncLock()

  const toggleLike = () => {
    if (!requireLogin()) {
      return
    }

    const previousLiked = liked
    const previousLikeCount = likeCount
    const nextLiked = !previousLiked
    const nextLikeCount = Math.max(
      0,
      previousLikeCount + (previousLiked ? -1 : 1),
    )

    return run(async () => {
      onChange({ liked: nextLiked, likeCount: nextLikeCount })

      try {
        if (previousLiked) {
          await unlikePost(postId)
        } else {
          await likePost(postId)
        }
      } catch (error) {
        onChange({
          liked: previousLiked,
          likeCount: previousLikeCount,
        })
        console.error(
          previousLiked ? '좋아요 취소 실패' : '좋아요 등록 실패',
          error,
        )

        if (error?.status === 404) {
          alert(POST_NOT_FOUND_MESSAGE)
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '좋아요를 변경할 권한이 없습니다.',
              fallback: previousLiked
                ? '좋아요 취소에 실패했습니다.'
                : '좋아요 등록에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    isUpdatingLike,
    toggleLike,
  }
}
