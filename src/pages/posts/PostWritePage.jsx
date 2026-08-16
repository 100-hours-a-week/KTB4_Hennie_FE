import { useState } from 'react'
import DraftListModal from '../../features/posts/components/DraftListModal'
import PostEditorFields from '../../features/posts/components/PostEditorFields'
import { usePostDrafts } from '../../features/posts/hook/usePostDrafts'
import { usePublishPost } from '../../features/posts/hook/usePublishPost'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import {
  CATEGORY_REQUIRED_MESSAGE,
  TITLE_CONTENT_REQUIRED_MESSAGE,
} from '../../shared/utils/constants'

function PostWritePage() {
  usePageTitle('게시글 작성')
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [formError, setFormError] = useState('')

  const {
    draftPostId,
    drafts,
    draftCount,
    isLoadingDrafts,
    loadingDraftId,
    deletingDraftId,
    isSavingDraft,
    saveCurrentDraft,
    loadDraftsForModal,
    selectDraft,
    removeDraft,
  } = usePostDrafts({
    enabled: true,
    title,
    content,
    category,
    setFormError,
    loadDraftIntoForm: (draft) => {
      setTitle(draft.title)
      setContent(draft.content)
      setCategory(draft.category)
      setFormError('')
    },
  })

  const isDraftBusy = Boolean(
    isSavingDraft || loadingDraftId || deletingDraftId,
  )
  const { isPublishing, publishPost } = usePublishPost({
    title,
    content,
    category,
    draftPostId,
    isBlocked: isDraftBusy,
    setFormError,
  })

  const isFormBusy = isDraftBusy || isPublishing

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
    setFormError('')
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
    setFormError('')
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    setFormError('')
  }

  const handleOpenDraftModal = async () => {
    if (await loadDraftsForModal()) {
      setIsDraftModalOpen(true)
    }
  }

  const handleSelectDraft = async (postId) => {
    if (await selectDraft(postId)) {
      setIsDraftModalOpen(false)
    }
  }

  const isPublishReady = Boolean(title.trim() && content.trim() && category)
  const helperMessage =
    formError ||
    (!title.trim() || !content.trim()
      ? TITLE_CONTENT_REQUIRED_MESSAGE
      : !category
        ? CATEGORY_REQUIRED_MESSAGE
        : '')

  return (
    <>
      <section className="mx-auto max-w-[760px] px-4 pt-6 pb-[112px] sm:px-6 sm:pt-8">
        <form className="flex flex-col gap-6" onSubmit={publishPost}>
          <PostEditorFields
            title={title}
            content={content}
            category={category}
            helperMessage={helperMessage}
            disabled={isFormBusy}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onCategoryChange={handleCategoryChange}
          />

          <footer className="fixed right-0 bottom-0 left-0 z-[90] border-t border-app-border bg-app-bg">
            <div className="mx-auto flex max-w-[760px] items-center justify-end gap-3 px-4 py-3 sm:px-6">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_36px] items-stretch">
                <button
                  className="app-btn app-btn-outline h-10 rounded-r-none px-4"
                  type="button"
                  disabled={isFormBusy}
                  onClick={saveCurrentDraft}
                >
                  {isSavingDraft ? '저장 중...' : '임시저장'}
                </button>
                <button
                  className="app-btn app-btn-outline h-10 rounded-l-none border-l-0 px-0 font-semibold text-app-primary"
                  type="button"
                  aria-label="임시 저장 목록 열기"
                  disabled={isFormBusy || isLoadingDrafts}
                  onClick={handleOpenDraftModal}
                >
                  {draftCount}
                </button>
              </div>

              <button
                className="app-btn app-btn-primary app-btn-md min-w-[104px]"
                type="submit"
                disabled={!isPublishReady || isFormBusy}
              >
                {isPublishing ? '발행 중...' : '완료'}
              </button>
            </div>
          </footer>
        </form>
      </section>

      <DraftListModal
        isOpen={isDraftModalOpen}
        drafts={drafts}
        editingDraftId={draftPostId}
        loadingDraftId={loadingDraftId}
        deletingDraftId={deletingDraftId}
        onClose={() => setIsDraftModalOpen(false)}
        onSelect={handleSelectDraft}
        onDelete={removeDraft}
      />
    </>
  )
}

export default PostWritePage
