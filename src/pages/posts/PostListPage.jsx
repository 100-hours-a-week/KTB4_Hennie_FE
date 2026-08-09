import { useCallback, useEffect, useRef, useState } from 'react'
import { getPostList } from '../../features/posts/api/postApi'
import PostList from '../../features/posts/components/PostList'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import { DEFAULT_PAGE_SIZE } from '../../shared/utils/constants'
import { getListStatusMessage } from '../../shared/utils/listStatusMessage'

const POST_LIST_LABEL = '게시글'

function PostListPage() {
  usePageTitle('게시글 목록')

  const sentinelRef = useRef(null)
  const lifecycleControllerRef = useRef(null)
  const isRequestingRef = useRef(false)
  const [posts, setPosts] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState('')

  const loadPostListPage = useCallback(async (page, { append }) => {
    const signal = lifecycleControllerRef.current?.signal

    if (!signal || signal.aborted || isRequestingRef.current) {
      return
    }

    isRequestingRef.current = true

    await Promise.resolve()

    if (signal.aborted) {
      return
    }

    setIsLoading(true)
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
        isRequestingRef.current = false
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()
    lifecycleControllerRef.current = controller
    isRequestingRef.current = false

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
        isRequestingRef.current = false
      }
    }
  }, [loadPostListPage])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || isLoading || error || !hasNextPage || currentPage < 1) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        observer.disconnect()
        loadPostListPage(currentPage + 1, {
          append: true,
        })
      },
      {
        rootMargin: '180px 0px',
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [currentPage, error, hasNextPage, isLoading, loadPostListPage])

  const statusMessage = getListStatusMessage({
    label: POST_LIST_LABEL,
    currentPage,
    error,
    hasNextPage,
    isLoading,
  })

  return (
    <section className="mx-auto max-w-[760px] px-4 pt-6 pb-24 sm:px-6 sm:pt-10">
      <p className="app-hero mb-8 text-base leading-[1.75] font-medium text-app-text-muted sm:text-lg">
        기업 <strong className="font-bold text-app-primary">개발</strong> 부서가
        남긴 기술 <strong className="font-bold text-app-primary">발자국</strong>
        을 따라
        <br />
        <strong className="font-bold text-app-text">개발자국(의견)</strong>을
        남겨보세요
      </p>

      <PostList posts={posts} />

      <div className="app-list-status" ref={sentinelRef} aria-live="polite">
        {statusMessage}
      </div>
    </section>
  )
}

export default PostListPage
