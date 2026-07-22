import { useState } from 'react'
import { getHttpErrorMessage } from '../../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../../shared/hook/useAsyncLock'
import { deleteComment } from '../../api/commentApi'

export const useDeleteComment = ({ postId, removeComment }) => {
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const { isRunning: isDeletingComment, run } = useAsyncLock()

  const openDeleteCommentModal = (commentId) => {
    if (commentId != null) {
      setDeletingCommentId(commentId)
    }
  }

  const closeDeleteCommentModal = () => {
    if (!isDeletingComment) {
      setDeletingCommentId(null)
    }
  }

  const confirmDeleteComment = () => {
    if (deletingCommentId == null) {
      return
    }

    const commentId = deletingCommentId

    return run(async () => {
      // 낙관적 제거 + 롤백 준비
      const rollback = removeComment(commentId)
      setDeletingCommentId(null)

      try {
        await deleteComment(postId, commentId)
      } catch (error) {
        console.error('댓글 삭제 실패', error)

        if (error?.status === 404) {
          alert('이미 삭제되었거나 존재하지 않는 댓글입니다.')
        } else {
          rollback()
          alert(
            getHttpErrorMessage(error, {
              forbidden: '댓글을 삭제할 권한이 없습니다.',
              fallback: '댓글 삭제에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    deletingCommentId,
    isDeletingComment,
    openDeleteCommentModal,
    closeDeleteCommentModal,
    confirmDeleteComment,
  }
}
