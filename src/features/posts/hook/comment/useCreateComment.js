import { useState } from 'react'
import { getHttpErrorMessage } from '../../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../../shared/hook/useAsyncLock'
import { createComment } from '../../api/commentApi'
import { useNavigateLogin } from '../useNavigateLogin'
import {
  COMMENT_REQUIRED_MESSAGE,
  POST_NOT_FOUND_MESSAGE,
} from '../../../../shared/utils/constants'

export const useCreateComment = ({ postId, onCreated }) => {
  const requireLogin = useNavigateLogin()
  const [content, setContent] = useState('')
  const { isRunning: isCreating, run } = useAsyncLock()

  const changeContent = (event) => setContent(event.target.value)
  const replaceContent = (nextContent) => setContent(nextContent)

  const submitComment = (event) => {
    event.preventDefault()

    if (!requireLogin()) {
      return
    }

    const trimmedContent = content.trim()

    if (!trimmedContent) {
      alert(COMMENT_REQUIRED_MESSAGE)
      return
    }

    return run(async () => {
      try {
        const created = await createComment(postId, {
          content: trimmedContent,
        })
        setContent('')
        onCreated(created)
      } catch (error) {
        console.error('댓글 작성 실패', error)

        if (error?.status === 404) {
          alert(POST_NOT_FOUND_MESSAGE)
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '댓글을 작성할 권한이 없습니다.',
              fallback: '댓글 작성에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    content,
    isCreating,
    changeContent,
    replaceContent,
    submitComment,
  }
}
