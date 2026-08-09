import { useCallback, useEffect, useRef, useState } from 'react'
import { getTechArticleList } from '../api/techArticleApi'
import { getTechArticleErrorMessage } from '../utils/techArticleErrorMessage'

export function useTechArticleList(enterprise) {
  const lifecycleControllerRef = useRef(null)
  const isRequestingRef = useRef(false)
  const [articles, setArticles] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState('')

  const loadPage = useCallback(
    async (page, { append }) => {
      if (!enterprise) {
        setArticles([])
        setCurrentPage(0)
        setIsLoading(false)
        setHasNextPage(false)
        setError('')
        return
      }

      const signal = lifecycleControllerRef.current?.signal

      if (!signal || signal.aborted || isRequestingRef.current) {
        return
      }

      isRequestingRef.current = true

      await Promise.resolve()

      if (signal.aborted) {
        return
      }

      if (!append) {
        // 기업이 바뀌면 이전 기업 목록을 먼저 비운다
        setArticles(null)
        setCurrentPage(0)
        setHasNextPage(true)
      }

      setIsLoading(true)
      setError('')

      try {
        const { articles: nextArticles, pagination } = await getTechArticleList(
          {
            enterprise,
            page,
          },
          { signal },
        )

        if (signal.aborted) {
          return
        }

        setArticles((currentArticles) =>
          append ? [...(currentArticles || []), ...nextArticles] : nextArticles,
        )
        setCurrentPage(page)
        setHasNextPage(pagination.hasNext)
      } catch (requestError) {
        if (requestError.name !== 'AbortError' && !signal.aborted) {
          console.error('기술 원문 목록 조회 실패', requestError)
          setError(getTechArticleErrorMessage(requestError))
        }
      } finally {
        if (!signal.aborted) {
          isRequestingRef.current = false
          setIsLoading(false)
        }
      }
    },
    [enterprise],
  )

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()
    lifecycleControllerRef.current = controller
    isRequestingRef.current = false

    queueMicrotask(() => {
      if (isActive) {
        loadPage(1, {
          append: false,
        })
      }
    })

    return () => {
      isActive = false
      controller.abort()

      if (lifecycleControllerRef.current === controller) {
        lifecycleControllerRef.current = null
        isRequestingRef.current = false
      }
    }
  }, [loadPage])

  const loadNextPage = useCallback(() => {
    loadPage(currentPage + 1, {
      append: true,
    })
  }, [currentPage, loadPage])

  return {
    articles,
    currentPage,
    error,
    hasNextPage,
    isLoading,
    loadNextPage,
  }
}
