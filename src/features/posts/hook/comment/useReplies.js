import { useState } from 'react'
import {
  createReply as createReplyApi,
  deleteReply as deleteReplyApi,
  updateReply as updateReplyApi,
} from '../../api/commentApi'
import { useAsyncLock } from '../../../../shared/hook/useAsyncLock'
import { getHttpErrorMessage } from '../../../../shared/utils/httpErrorMessage'
import { useNavigateLogin } from '../useNavigateLogin'

export const useReplies = ({ postId, addReply, updateReply }) => {
  const requireLogin = useNavigateLogin()
  const [deletingReply, setDeletingReply] = useState(null)
  const { isRunning: isCreatingReply, run: runCreate } = useAsyncLock()
  const { isRunning: isUpdatingReply, run: runUpdate } = useAsyncLock()
  const { isRunning: isDeletingReply, run: runDelete } = useAsyncLock()

  const createReply = ({ commentId, replyToId, content }) => {
    if (!requireLogin()) {
      return Promise.resolve(false)
    }

    const trimmedContent = content.trim()

    if (!trimmedContent || commentId == null || replyToId == null) {
      alert('답글 내용을 입력해주세요.')
      return Promise.resolve(false)
    }

    return runCreate(async () => {
      try {
        const created = await createReplyApi(postId, commentId, {
          content: trimmedContent,
          replyToId,
        })
        addReply(commentId, created)
        return true
      } catch (error) {
        console.error('답글 작성 실패', error)
        alert(
          getHttpErrorMessage(error, {
            forbidden: '답글을 작성할 권한이 없습니다.',
            fallback:
              error?.status === 404
                ? '답글 대상을 찾을 수 없습니다.'
                : '답글 작성에 실패했습니다.',
          }),
        )
        return false
      }
    })
  }

  const updateReplyContent = ({ commentId, replyId, content }) => {
    const trimmedContent = content.trim()

    if (!trimmedContent || commentId == null || replyId == null) {
      alert('답글 내용을 입력해주세요.')
      return Promise.resolve(false)
    }

    return runUpdate(async () => {
      const rollback = updateReply(commentId, replyId, {
        content: trimmedContent,
        edited: true,
      })

      try {
        const updated = await updateReplyApi(postId, commentId, replyId, {
          content: trimmedContent,
        })
        updateReply(commentId, replyId, updated)
        return true
      } catch (error) {
        console.error('답글 수정 실패', error)
        rollback()
        alert(
          getHttpErrorMessage(error, {
            forbidden: '답글을 수정할 권한이 없습니다.',
            fallback:
              error?.status === 404
                ? '답글을 찾을 수 없습니다.'
                : '답글 수정에 실패했습니다.',
          }),
        )
        return false
      }
    })
  }

  const openDeleteReplyModal = (commentId, replyId) => {
    if (commentId != null && replyId != null) {
      setDeletingReply({ commentId, replyId })
    }
  }

  const closeDeleteReplyModal = () => {
    if (!isDeletingReply) {
      setDeletingReply(null)
    }
  }

  const confirmDeleteReply = () => {
    if (!deletingReply) {
      return undefined
    }

    const { commentId, replyId } = deletingReply

    return runDelete(async () => {
      const rollback = updateReply(commentId, replyId, {
        authorId: null,
        authorNickname: '알 수 없음',
        content: '삭제된 댓글입니다',
        deleted: true,
      })
      setDeletingReply(null)

      try {
        await deleteReplyApi(postId, commentId, replyId)
      } catch (error) {
        console.error('답글 삭제 실패', error)

        if (error?.status === 404) {
          alert('이미 삭제되었거나 존재하지 않는 답글입니다.')
          return
        }

        rollback()
        alert(
          getHttpErrorMessage(error, {
            forbidden: '답글을 삭제할 권한이 없습니다.',
            fallback: '답글 삭제에 실패했습니다.',
          }),
        )
      }
    })
  }

  return {
    deletingReply,
    isCreatingReply,
    isUpdatingReply,
    isDeletingReply,
    createReply,
    updateReply: updateReplyContent,
    openDeleteReplyModal,
    closeDeleteReplyModal,
    confirmDeleteReply,
  }
}
