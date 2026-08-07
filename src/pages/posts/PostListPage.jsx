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
  const requestControllerRef = useRef(null)
  const [posts, setPosts] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [error, setError] = useState('')

  const loadPostListPage = useCallback(async (page, { append }) => {
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

    setIsLoading(true)
    setError('')

    try {
      const { posts: nextPosts, pagination } = await getPostList(
        {
          page,
          size: DEFAULT_PAGE_SIZE,
        },
        { signal: controller.signal },
      )

      setPosts((currentPosts) =>
        append ? [...(currentPosts || []), ...nextPosts] : nextPosts,
      )
      setCurrentPage(page)
      setHasNextPage(pagination.hasNext)
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        console.error('게시글 목록 조회 실패', requestError)
        setError('게시글 목록을 불러오지 못했습니다.')
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null

        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }
  }, [])

  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (isActive) {
        loadPostListPage(1, {
          append: false,
        })
      }
    })

    return () => {
      isActive = false
      requestControllerRef.current?.abort()
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
    <section className="mx-auto max-w-[720px] px-6 pt-8 pb-24">
      <p className="mb-6 text-center text-base leading-[1.6]">
        기업 <strong className="font-bold">개발</strong> 부서가 남긴 기술{' '}
        <strong className="font-bold">발자국</strong>을 따라
        <br />
        <strong className="font-bold">개발자국(의견)</strong>을 남겨보세요...🐾
      </p>

      <PostList posts={posts} />

      <div
        className="min-h-10 py-5 text-center text-xs text-app-text-muted"
        ref={sentinelRef}
        aria-live="polite"
      >
        {statusMessage}
      </div>
    </section>
  )
}

export default PostListPage
