import { useCallback, useEffect, useState } from 'react'
import { getPost } from '../api/postApi'

const isValidPostId = (postId) => /^\d+$/.test(postId || '')

// 게시글 상세 조회 책임: postId 변경 시 fetch + 로딩/에러 상태 관리
export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshPost = useCallback(async () => {
    const nextPost = await getPost(postId)

    if (!nextPost) {
      throw new Error('게시글을 찾을 수 없습니다.')
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
        setError('게시글을 찾을 수 없습니다.')
        setIsLoading(false)
        return
      }

      try {
        const nextPost = await getPost(postId, { signal: controller.signal })

        if (!nextPost) {
          setError('게시글을 찾을 수 없습니다.')
          return
        }

        setPost(nextPost)
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        console.error('게시글 상세 조회 실패', requestError)
        setError(
          requestError.status === 404
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

  return { post, isLoading, error, refreshPost, updateLikeState }
}
