import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { createPost } from '../api/postApi'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'

export const usePublishPost = ({
  title,
  content,
  draftPostId,
  isBlocked,
  setFormError,
}) => {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const isPublishingRef = useRef(false)

  const publishPost = async (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    setFormError('')

    if (!trimmedTitle || !trimmedContent) {
      setFormError('제목,내용을 모두 작성해주세요')
      return
    }

    if (isBlocked || isPublishingRef.current) {
      return
    }

    isPublishingRef.current = true
    setIsPublishing(true)

    try {
      await createPost({
        postId: draftPostId,
        title: trimmedTitle,
        content: trimmedContent,
        imageUrl: '',
      })

      alert('게시글이 등록되었습니다.')
      navigate('/posts')
    } catch (error) {
      console.error('게시글 작성 실패', error)

      if (error?.status === 400) {
        setFormError('제목,내용을 모두 작성해주세요')
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
    } finally {
      isPublishingRef.current = false
      setIsPublishing(false)
    }
  }

  return {
    isPublishing,
    publishPost,
  }
}
