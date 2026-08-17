import { useRef } from 'react'
import PostList from '../../features/posts/components/PostList'
import PostListSkeleton from '../../features/posts/components/PostListSkeleton'
import { usePostList } from '../../features/posts/hook/usePostList'
import { useInfiniteScroll } from '../../shared/hook/useInfiniteScroll'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import { getListStatusMessage } from '../../shared/utils/listStatusMessage'
import { POST_LIST_LABEL } from '../../shared/utils/constants'

function PostListPage() {
  usePageTitle('게시글 목록')

  const sentinelRef = useRef(null)
  const { posts, currentPage, error, hasNextPage, isLoading, loadNextPage } =
    usePostList()

  useInfiniteScroll({
    targetRef: sentinelRef,
    enabled: !isLoading && !error && hasNextPage && currentPage >= 1,
    onIntersect: loadNextPage,
  })

  const statusMessage = getListStatusMessage({
    label: POST_LIST_LABEL,
    currentPage,
    error,
    hasNextPage,
    isLoading,
  })

  return (
    <section className="mx-auto max-w-[840px] px-4 pt-6 pb-20 sm:px-6 sm:pt-8">
      <p className="app-page-intro">
        기업 <strong className="font-bold text-app-primary">개발</strong> 부서가
        남긴 기술 <strong className="font-bold text-app-primary">발자국</strong>
        을 따라
        <br />
        <strong className="font-bold text-app-text">개발자국(의견)</strong>을
        남겨보세요...🐾
      </p>

      {posts === null ? <PostListSkeleton /> : <PostList posts={posts} />}

      <div className="app-list-status" ref={sentinelRef} aria-live="polite">
        {statusMessage}
      </div>
    </section>
  )
}

export default PostListPage
