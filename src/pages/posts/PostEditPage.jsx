import { useParams } from 'react-router'
import { useEditPost } from '../../features/posts/hook/useEditPost'
import PostEditorFields from '../../features/posts/components/PostEditorFields'
import LoadingPage from '../../shared/components/LoadingPage'
import NotFoundPage from '../../shared/components/NotFoundPage'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function PostEditPage() {
  usePageTitle('게시글 수정')

  const { postId } = useParams()
  const {
    title,
    content,
    category,
    formError,
    loadError,
    isLoading,
    isUpdating,
    changeTitle,
    changeContent,
    changeCategory,
    submitPostEdit,
  } = useEditPost(postId)

  if (isLoading) {
    return <LoadingPage message="게시글을 불러오는 중입니다..." />
  }

  if (loadError) {
    return (
      <NotFoundPage
        title="게시글을 불러올 수 없습니다"
        description={loadError}
      />
    )
  }

  const isEditReady = Boolean(title.trim() && content.trim() && category)
  const helperMessage =
    formError ||
    (!title.trim() || !content.trim()
      ? '제목,내용을 모두 작성해주세요'
      : !category
        ? '유형을 선택해주세요'
        : '')

  return (
    <section className="mx-auto max-w-[760px] px-4 pt-6 pb-[112px] sm:px-6 sm:pt-8">
      <form className="flex flex-col gap-6" onSubmit={submitPostEdit}>
        <PostEditorFields
          title={title}
          content={content}
          category={category}
          helperMessage={helperMessage}
          disabled={isUpdating}
          onTitleChange={changeTitle}
          onContentChange={changeContent}
          onCategoryChange={changeCategory}
        />

        <footer className="fixed right-0 bottom-0 left-0 z-[90] border-t border-app-border bg-app-bg">
          <div className="mx-auto flex max-w-[760px] items-center justify-end gap-3 px-4 py-3 sm:px-6">
            <button
              className="app-btn app-btn-primary app-btn-md min-w-[104px]"
              type="submit"
              disabled={!isEditReady || isUpdating}
            >
              {isUpdating ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </footer>
      </form>
    </section>
  )
}

export default PostEditPage
