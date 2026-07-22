import { useState } from 'react'
import { getHttpErrorMessage } from '../../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../../shared/hook/useAsyncLock'
import { createComment } from '../../api/commentApi'
import { useNavigateLogin } from '../useNavigateLogin'

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
      alert('댓글 내용을 입력해주세요.')
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
          alert('게시글을 찾을 수 없습니다.')
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
