import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { getPost, updatePost } from '../api/postApi'

const isValidPostId = (postId) => /^\d+$/.test(postId || '')

export const useEditPost = (postId) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [formError, setFormError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { isRunning: isUpdating, run } = useAsyncLock()

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    queueMicrotask(async () => {
      if (!isActive) {
        return
      }

      setTitle('')
      setContent('')
      setSelectedFileName('')
      setFormError('')
      setLoadError('')
      setIsLoading(true)

      if (!isValidPostId(postId)) {
        setLoadError('게시글을 찾을 수 없습니다.')
        setIsLoading(false)
        return
      }

      try {
        const post = await getPost(postId, { signal: controller.signal })

        if (!post) {
          setLoadError('게시글을 찾을 수 없습니다.')
          return
        }

        setTitle(post.title)
        setContent(post.content)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        console.error('수정할 게시글 조회 실패', error)
        setLoadError(
          error?.status === 404
            ? '게시글을 찾을 수 없습니다.'
            : '게시글을 불러오지 못했습니다.',
        )
      } finally {
        if (isActive && !controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [postId])

  const changeTitle = (event) => {
    setTitle(event.target.value)
    setFormError('')
  }

  const changeContent = (event) => {
    setContent(event.target.value)
    setFormError('')
  }

  const changeImage = (event) => {
    setSelectedFileName(event.target.files?.[0]?.name || '')
  }

  const submitPostEdit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    setFormError('')

    if (!trimmedTitle || !trimmedContent) {
      setFormError('제목,내용을 모두 작성해주세요')
      return
    }

    return run(async () => {
      try {
        await updatePost(postId, {
          title: trimmedTitle,
          content: trimmedContent,
          imageUrl: '',
        })

        alert('게시글이 수정되었습니다.')
        navigate(`/posts/${postId}`)
      } catch (error) {
        console.error('게시글 수정 실패', error)

        if (error?.status === 400) {
          setFormError('제목,내용을 모두 작성해주세요')
        } else if (error?.status === 404) {
          alert('게시글을 찾을 수 없습니다.')
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '게시글을 수정할 권한이 없습니다.',
              fallback: '게시글 수정에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    title,
    content,
    selectedFileName,
    formError,
    loadError,
    isLoading,
    isUpdating,
    changeTitle,
    changeContent,
    changeImage,
    submitPostEdit,
  }
}
