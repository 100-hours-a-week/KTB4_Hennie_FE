import { useState } from 'react'
import DraftListModal from '../../features/posts/components/DraftListModal'
import PostEditorFields from '../../features/posts/components/PostEditorFields'
import { usePostDrafts } from '../../features/posts/hook/usePostDrafts'
import { usePublishPost } from '../../features/posts/hook/usePublishPost'
import { usePageTitle } from '../../shared/hook/usePageTitle'

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
      ? '제목,내용을 모두 작성해주세요'
      : !category
        ? '유형을 선택해주세요'
        : '')

  return (
    <>
      <section className="mx-auto max-w-[720px] px-6 pt-8 pb-[120px]">
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

          <footer className="fixed right-0 bottom-0 left-0 z-[90] border-t border-app-border bg-app-bg/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[720px] items-center justify-end gap-3 px-6 py-3">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_36px] items-stretch">
                <button
                  className="h-11 rounded-l-md border border-[#3a3e44] bg-app-surface px-4 text-sm text-app-text-muted hover:bg-app-surface-raised hover:text-app-text"
                  type="button"
                  disabled={isFormBusy}
                  onClick={saveCurrentDraft}
                >
                  {isSavingDraft ? '저장 중...' : '임시저장'}
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-r-md border border-l-0 border-[#3a3e44] bg-app-surface text-sm font-bold text-app-primary hover:bg-app-surface-raised"
                  type="button"
                  aria-label="임시 저장 목록 열기"
                  disabled={isFormBusy || isLoadingDrafts}
                  onClick={handleOpenDraftModal}
                >
                  {draftCount}
                </button>
              </div>

              <button
                className="h-11 min-w-[120px] rounded-md bg-app-primary px-4 text-sm font-bold text-white hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
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
