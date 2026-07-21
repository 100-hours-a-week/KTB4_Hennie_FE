import { useState } from 'react'
import DraftListModal from '../../features/posts/components/DraftListModal'
import { usePostDrafts } from '../../features/posts/hook/usePostDrafts'
import { usePublishPost } from '../../features/posts/hook/usePublishPost'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function PostWritePage() {
  usePageTitle('게시글 작성')
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')

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
    setFormError,
    loadDraftIntoForm: (draft) => {
      setTitle(draft.title)
      setContent(draft.content)
      setFormError('')
    },
  })

  const isDraftBusy = Boolean(
    isSavingDraft || loadingDraftId || deletingDraftId,
  )
  const { isPublishing, publishPost } = usePublishPost({
    title,
    content,
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

  const handleImageChange = (event) => {
    setSelectedFileName(event.target.files?.[0]?.name || '')
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

  const isPublishReady = Boolean(title.trim() && content.trim())
  const helperMessage =
    formError || (!isPublishReady ? '제목,내용을 모두 작성해주세요' : '')

  return (
    <>
      <section className="mx-auto max-w-[720px] px-6 pt-8 pb-[120px]">
        <form className="flex flex-col gap-6" onSubmit={publishPost}>
          {/* <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="category">
              태그
            </label>
            <select
              className="h-11 rounded-sm border border-[#3a3e44] bg-app-surface px-3 text-sm text-app-text focus:border-app-primary focus:outline-none"
              id="category"
              name="category"
              defaultValue=""
            >
              <option value="" disabled>
                직무를 선택해주세요
              </option>
              <option value="FE">프론트엔드</option>
              <option value="BE">백엔드</option>
              <option value="AI">AI</option>
            </select>
          </div> */}

          <div className="flex flex-col gap-2">
            <div className="flex flex-col overflow-hidden rounded-md border border-app-border bg-app-surface">
              <input
                className="border-b border-app-border bg-transparent p-4 text-[22px] font-bold text-app-text placeholder:font-normal placeholder:text-[#6b7178] focus:outline-none"
                id="title"
                name="title"
                type="text"
                maxLength={26}
                placeholder="제목을 입력하세요."
                disabled={isFormBusy}
                value={title}
                onChange={handleTitleChange}
              />
              <textarea
                className="min-h-[420px] resize-y bg-transparent p-4 text-base leading-[1.7] text-app-text placeholder:text-[#6b7178] focus:outline-none"
                id="content"
                name="content"
                placeholder="내용을 입력하세요."
                disabled={isFormBusy}
                value={content}
                onChange={handleContentChange}
              />
            </div>
            <p className="min-h-4 text-xs leading-[1.4] text-app-error">
              {helperMessage ? `* ${helperMessage}` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="image">
              이미지
            </label>
            <div className="flex items-center gap-3">
              <label
                className="shrink-0 cursor-pointer rounded-sm border border-[#3a3e44] bg-app-surface px-3 py-2 text-sm hover:bg-app-bg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
                htmlFor="image"
              >
                파일 선택
                <input
                  className="sr-only"
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  disabled={isFormBusy}
                  onChange={handleImageChange}
                />
              </label>
              <span className="min-w-0 truncate text-sm text-app-text-muted">
                {selectedFileName || '파일을 선택해주세요.'}
              </span>
            </div>
          </div>

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
