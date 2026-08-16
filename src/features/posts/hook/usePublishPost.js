import { useNavigate } from 'react-router'
import { createPost } from '../api/postApi'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import {
  CATEGORY_REQUIRED_MESSAGE,
  TITLE_CONTENT_REQUIRED_MESSAGE,
} from '../../../shared/utils/constants'

export const usePublishPost = ({
  title,
  content,
  category,
  draftPostId,
  isBlocked,
  setFormError,
}) => {
  const navigate = useNavigate()
  const { isRunning: isPublishing, run } = useAsyncLock()

  const publishPost = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    setFormError('')

    if (!trimmedTitle || !trimmedContent) {
      setFormError(TITLE_CONTENT_REQUIRED_MESSAGE)
      return
    }

    if (!category) {
      setFormError(CATEGORY_REQUIRED_MESSAGE)
      return
    }

    if (isBlocked) {
      return
    }

    return run(async () => {
      try {
        await createPost({
          postId: draftPostId,
          title: trimmedTitle,
          content: trimmedContent,
          category,
        })

        alert('게시글이 등록되었습니다.')
        navigate('/posts')
      } catch (error) {
        console.error('게시글 작성 실패', error)

        if (error?.status === 400) {
          setFormError(TITLE_CONTENT_REQUIRED_MESSAGE)
        } else if (error?.status === 404 && draftPostId !== null) {
          alert('발행할 임시저장 글을 찾을 수 없습니다.')
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '게시글을 작성할 권한이 없습니다.',
              fallback: '게시글 작성에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    isPublishing,
    publishPost,
  }
}
