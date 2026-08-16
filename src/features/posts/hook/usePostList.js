import { useCallback, useEffect, useRef, useState } from 'react'
import { getPostList } from '../api/postApi'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { DEFAULT_PAGE_SIZE } from '../../../shared/utils/constants'

export function usePostList() {
  const lifecycleControllerRef = useRef(null)
  const { isRunning, run } = useAsyncLock()
  const [posts, setPosts] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState('')

  const isLoading = isRunning || isInitialLoading

  const loadPostListPage = useCallback(
    async (page, { append }) => {
      const signal = lifecycleControllerRef.current?.signal

      if (!signal || signal.aborted) {
        return
      }

      await run(async () => {
        await Promise.resolve()

        if (signal.aborted) {
          return
        }

        setError('')

        try {
          const { posts: nextPosts, pagination } = await getPostList(
            {
              page,
              size: DEFAULT_PAGE_SIZE,
            },
            { signal },
          )

          if (signal.aborted) {
            return
          }

          setPosts((currentPosts) =>
            append ? [...(currentPosts || []), ...nextPosts] : nextPosts,
          )
          setCurrentPage(page)
          setHasNextPage(pagination.hasNext)
        } catch (requestError) {
          if (requestError.name !== 'AbortError' && !signal.aborted) {
            console.error('게시글 목록 조회 실패', requestError)
            setError('게시글 목록을 불러오지 못했습니다.')
          }
        } finally {
          if (!signal.aborted) {
            setIsInitialLoading(false)
          }
        }
      })
    },
    [run],
  )

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()
    lifecycleControllerRef.current = controller

    queueMicrotask(() => {
      if (isActive) {
        loadPostListPage(1, {
          append: false,
        })
      }
    })

    return () => {
      isActive = false
      controller.abort()

      if (lifecycleControllerRef.current === controller) {
        lifecycleControllerRef.current = null
      }
    }
  }, [loadPostListPage])

  const loadNextPage = useCallback(() => {
    loadPostListPage(currentPage + 1, {
      append: true,
    })
  }, [currentPage, loadPostListPage])

  return {
    posts,
    currentPage,
    error,
    hasNextPage,
    isLoading,
    loadNextPage,
  }
}
