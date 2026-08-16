import { getHttpErrorMessage } from '../../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../../shared/hook/useAsyncLock'
import { updateComment as updateCommentApi } from '../../api/commentApi'
import { COMMENT_REQUIRED_MESSAGE } from '../../../../shared/utils/constants'

export const useUpdateComment = ({
  postId,
  onUpdateSuccess,
  updateComment,
}) => {
  const { isRunning: isUpdatingComment, run } = useAsyncLock()

  const submitUpdatedComment = (event, commentId, content) => {
    event.preventDefault()

    const trimmedContent = content.trim()

    if (!trimmedContent) {
      alert(COMMENT_REQUIRED_MESSAGE)
      return
    }

    if (commentId == null) {
      return
    }

    return run(async () => {
      // 낙관적 반영
      const rollback = updateComment(commentId, {
        content: trimmedContent,
        edited: true,
      })

      try {
        const updated = await updateCommentApi(postId, commentId, {
          content: trimmedContent,
        })

        if (updated?.id != null) {
          updateComment(commentId, updated)
        }

        onUpdateSuccess()
      } catch (error) {
        console.error('댓글 수정 실패', error)
        rollback()

        if (error?.status === 404) {
          alert('게시글 또는 댓글을 찾을 수 없습니다.')
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '댓글을 수정할 권한이 없습니다.',
              fallback: '댓글 수정에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    isUpdatingComment,
    submitUpdatedComment,
  }
}
