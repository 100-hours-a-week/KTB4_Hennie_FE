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
    selectedFileName,
    formError,
    loadError,
    isLoading,
    isUpdating,
    changeTitle,
    changeContent,
    changeImage,
    submitPostEdit,
  } = useEditPost(postId)

  if (isLoading) {
    return <LoadingPage message="게시글을 불러오는 중입니다..." />
  }

  if (loadError) {
    return (
      <NotFoundPage title="게시글을 불러올 수 없습니다" description={loadError} />
    )
  }

  const isEditReady = Boolean(title.trim() && content.trim())
  const helperMessage =
    formError || (!isEditReady ? '제목,내용을 모두 작성해주세요' : '')

  return (
    <section className="mx-auto max-w-[720px] px-6 pt-8 pb-[120px]">
      <form className="flex flex-col gap-6" onSubmit={submitPostEdit}>
        <PostEditorFields
          title={title}
          content={content}
          selectedFileName={selectedFileName}
          helperMessage={helperMessage}
          disabled={isUpdating}
          onTitleChange={changeTitle}
          onContentChange={changeContent}
          onImageChange={changeImage}
        />

        <footer className="fixed right-0 bottom-0 left-0 z-[90] border-t border-app-border bg-app-bg/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[720px] items-center justify-end gap-3 px-6 py-3">
            <button
              className="h-11 min-w-[120px] rounded-md bg-app-primary px-4 text-sm font-bold text-white hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:bg-app-surface-raised disabled:text-app-text-muted"
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
