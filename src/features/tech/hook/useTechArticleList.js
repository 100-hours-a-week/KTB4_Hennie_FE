import { useCallback, useEffect, useRef, useState } from 'react'
import { getTechArticleList } from '../api/techArticleApi'
import { getTechArticleErrorMessage } from '../utils/techArticleErrorMessage'

export function useTechArticleList(enterprise) {
  const requestControllerRef = useRef(null)
  const [articles, setArticles] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState('')

  const loadPage = useCallback(
    async (page, { append }) => {
      requestControllerRef.current?.abort()
      const controller = new AbortController()
      requestControllerRef.current = controller

      await Promise.resolve()

      if (controller.signal.aborted) {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null
        }

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
          { signal: controller.signal },
        )

        setArticles((currentArticles) =>
          append ? [...(currentArticles || []), ...nextArticles] : nextArticles,
        )
        setCurrentPage(page)
        setHasNextPage(pagination.hasNext)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          console.error('기술 원문 목록 조회 실패', requestError)
          setError(getTechArticleErrorMessage(requestError))
        }
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null

          if (!controller.signal.aborted) {
            setIsLoading(false)
          }
        }
      }
    },
    [enterprise],
  )

  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (isActive) {
        loadPage(1, {
          append: false,
        })
      }
    })

    return () => {
      isActive = false
      requestControllerRef.current?.abort()
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
