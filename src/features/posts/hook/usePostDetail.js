import { useCallback, useEffect, useState } from 'react'
import { getPost } from '../api/postApi'
import {
  ABORT_ERROR_NAME,
  POST_LOAD_FAILED_MESSAGE,
  POST_NOT_FOUND_MESSAGE,
} from '../../../shared/utils/constants'

const isValidPostId = (postId) => /^\d+$/.test(postId || '')

// 게시글 상세 조회 책임: postId 변경 시 fetch + 로딩/에러 상태 관리
export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshPost = useCallback(async () => {
    const nextPost = await getPost(postId)

    if (!nextPost) {
      throw new Error(POST_NOT_FOUND_MESSAGE)
    }

    setPost(nextPost)
    return nextPost
  }, [postId])

  const updateLikeState = useCallback(({ liked, likeCount }) => {
    setPost((currentPost) =>
      currentPost
        ? {
            ...currentPost,
            liked,
            likeCount: Math.max(0, likeCount),
          }
        : currentPost,
    )
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    queueMicrotask(async () => {
      if (!isActive) {
        return
      }

      setPost(null)
      setError('')
      setIsLoading(true)

      if (!isValidPostId(postId)) {
        setError(POST_NOT_FOUND_MESSAGE)
        setIsLoading(false)
        return
      }

      try {
        const nextPost = await getPost(postId, { signal: controller.signal })

        if (!nextPost) {
          setError(POST_NOT_FOUND_MESSAGE)
          return
        }

        setPost(nextPost)
      } catch (requestError) {
        if (requestError.name === ABORT_ERROR_NAME) {
          return
        }

        console.error('게시글 상세 조회 실패', requestError)
        setError(
          requestError.status === 404
            ? POST_NOT_FOUND_MESSAGE
            : POST_LOAD_FAILED_MESSAGE,
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

  return { post, isLoading, error, refreshPost, updateLikeState }
}
