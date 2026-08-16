import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { deletePost } from '../api/postApi'
import { POST_NOT_FOUND_MESSAGE } from '../../../shared/utils/constants'

export const useDeletePost = (postId) => {
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { isRunning: isDeleting, run } = useAsyncLock()

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  const removePost = () =>
    run(async () => {
      try {
        await deletePost(postId)
        setIsDeleteModalOpen(false)
        alert('게시글이 삭제되었습니다.')
        navigate('/posts')
      } catch (error) {
        console.error('게시글 삭제 실패', error)

        alert(
          getHttpErrorMessage(error, {
            notFound: POST_NOT_FOUND_MESSAGE,
            forbidden: '게시글을 삭제할 권한이 없습니다.',
            fallback: '게시글 삭제에 실패했습니다.',
          }),
        )
      }
    })

  return {
    isDeleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    removePost,
  }
}
