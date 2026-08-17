import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useComments } from '../../features/posts/hook/comment/useComments'
import { useCreateComment } from '../../features/posts/hook/comment/useCreateComment'
import { useDeleteComment } from '../../features/posts/hook/comment/useDeleteComment'
import { useReplyEditor } from '../../features/posts/hook/comment/useReplyEditor'
import { useReplies } from '../../features/posts/hook/comment/useReplies'
import { useDeletePost } from '../../features/posts/hook/useDeletePost'
import { usePostDetail } from '../../features/posts/hook/usePostDetail'
import { usePostLike } from '../../features/posts/hook/usePostLike'
import { useReportPost } from '../../features/posts/hook/useReportPost'
import { useUpdateComment } from '../../features/posts/hook/comment/useUpdateComment'
import CommentForm from '../../features/posts/components/CommentForm'
import CommentList from '../../features/posts/components/CommentList'
import PostDetailSkeleton from '../../features/posts/components/PostDetailSkeleton'
import { isOwnedByCurrentUser } from '../../features/posts/utils/isOwnedByCurrentUser'
import { useAuth } from '../../features/auth/hook/useAuth'
import NotFoundPage from '../../shared/components/NotFoundPage'
import { formatDate } from '../../shared/utils/formatDate'
import { getPostCategoryLabel } from '../../features/posts/utils/postCategory'
import { REPORT_REASON_OPTIONS } from '../../features/posts/utils/reportReason'
import { POST_NOT_FOUND_MESSAGE } from '../../shared/utils/constants'
import {
  CommentIcon,
  LikeIcon,
  ViewIcon,
} from '../../shared/components/IconsList'
import ConfirmModal from '../../shared/components/modal/ConfirmModal'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function PostDetailPage() {
  usePageTitle('게시글')
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { post, isLoading, error, refreshPost, updateLikeState } =
    usePostDetail(postId)
  const {
    comments,
    commentCount,
    addComment,
    removeComment,
    updateComment,
    addReply,
    updateReply: updateReplyInList,
  } = useComments(post)
  const { content, isCreating, changeContent, replaceContent, submitComment } =
    useCreateComment({
      postId,
      onCreated: addComment,
    })
  const commentInputRef = useRef(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [isEditCancelModalOpen, setIsEditCancelModalOpen] = useState(false)

  const resetCommentForm = () => {
    setEditingCommentId(null)
    setIsEditCancelModalOpen(false)
    replaceContent('')
  }

  const { isUpdatingComment, submitUpdatedComment } = useUpdateComment({
    postId,
    onUpdateSuccess: resetCommentForm,
    updateComment,
  })
  const {
    deletingCommentId,
    isDeletingComment,
    openDeleteCommentModal,
    closeDeleteCommentModal,
    confirmDeleteComment,
  } = useDeleteComment({
    postId,
    removeComment,
    refreshPost,
  })
  const {
    deletingReply,
    isCreatingReply,
    isUpdatingReply,
    isDeletingReply,
    createReply,
    updateReply: submitReplyUpdate,
    openDeleteReplyModal,
    closeDeleteReplyModal,
    confirmDeleteReply,
  } = useReplies({
    postId,
    addReply,
    updateReply: updateReplyInList,
  })
  const {
    inputRef: replyInputRef,
    editor: replyEditor,
    content: replyContent,
    isEditing: isEditingReply,
    isSubmitting: isReplySubmitting,
    startCreate: startReply,
    startEdit: startReplyEdit,
    changeContent: changeReplyContent,
    submit: submitReply,
    reset: resetReplyEditor,
  } = useReplyEditor({
    createReply,
    updateReply: submitReplyUpdate,
    isCreatingReply,
    isUpdatingReply,
    onStart: () => {
      if (editingCommentId != null) {
        resetCommentForm()
      }
    },
  })
  const {
    isDeleteModalOpen,
    isDeleting: isDeletingPost,
    openDeleteModal,
    closeDeleteModal,
    removePost,
  } = useDeletePost(postId)
  const { isUpdatingLike, toggleLike } = usePostLike({
    postId,
    liked: post?.liked ?? false,
    likeCount: post?.likeCount ?? 0,
    onChange: updateLikeState,
  })
  const {
    isReportModalOpen,
    reportReason,
    isReporting,
    reportReasonInputRef,
    openReportModal,
    closeReportModal,
    changeReportReason,
    submitReport,
  } = useReportPost(postId)

  const isEditingComment = editingCommentId != null
  const isCommentSubmitting = isCreating || isUpdatingComment

  const focusCommentForm = (nextContent = '') => {
    requestAnimationFrame(() => {
      commentInputRef.current?.focus()
      commentInputRef.current?.setSelectionRange(
        nextContent.length,
        nextContent.length,
      )
      commentInputRef.current?.closest('form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  const startCommentEdit = (comment) => {
    resetReplyEditor()
    setEditingCommentId(comment.id)
    replaceContent(comment.content)
    focusCommentForm(comment.content)
  }

  const cancelActiveEdit = () => {
    if (isEditingReply) {
      resetReplyEditor()
      setIsEditCancelModalOpen(false)
      return
    }

    resetCommentForm()
  }

  const handleCommentSubmit = (event) => {
    if (isEditingComment) {
      submitUpdatedComment(event, editingCommentId, content)
      return
    }

    submitComment(event)
  }

  if (!isLoading && (error || !post)) {
    return (
      <NotFoundPage
        title="게시글을 찾을 수 없습니다"
        description={error || POST_NOT_FOUND_MESSAGE}
      />
    )
  }

  const canManagePost = post ? isOwnedByCurrentUser(post, currentUser) : false
  const postDate = post?.createdAt || post?.modifiedAt

  return (
    <section className="mx-auto max-w-[760px] px-4 py-6 sm:px-6 sm:py-8">
      {isLoading ? (
        <div role="status" aria-live="polite">
          <p className="sr-only">게시글을 불러오는 중입니다...</p>
          <PostDetailSkeleton />
        </div>
      ) : (
        <article>
          <header className="mb-6 flex items-start justify-between gap-4 border-b border-app-border pb-5">
            <div className="min-w-0">
              <div className="mb-2.5 flex flex-col items-start gap-2">
                {getPostCategoryLabel(post.category) && (
                  <span className={`app-chip app-chip-${post.category}`}>
                    {getPostCategoryLabel(post.category)}
                  </span>
                )}
                <h1 className="min-w-0 text-[22px] leading-[1.35] font-bold break-words sm:text-[26px]">
                  {post.title}
                </h1>
              </div>

              <div className="app-meta">
                <span className="size-8 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
                  <img
                    className="size-full object-cover"
                    src={post.authorProfileUrl}
                    alt="작성자"
                    width={32}
                    height={32}
                  />
                </span>
                <span className="font-medium text-app-text-muted">
                  {post.authorNickname}
                </span>
                {postDate && (
                  <time dateTime={postDate}>{formatDate(postDate)}</time>
                )}
                {post.edited && (
                  <span className="text-app-text-subtle">(수정됨)</span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              {canManagePost ? (
                <>
                  <Link
                    className="app-btn app-btn-outline app-btn-xs"
                    to={`/posts/${postId}/edit`}
                  >
                    수정
                  </Link>
                  <button
                    className="app-btn app-btn-outline app-btn-xs"
                    type="button"
                    onClick={openDeleteModal}
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  className="app-btn app-btn-outline app-btn-xs"
                  type="button"
                  onClick={openReportModal}
                >
                  신고
                </button>
              )}
            </div>
          </header>

          <p className="mb-8 whitespace-pre-wrap text-[15px] leading-[1.8] text-app-text">
            {post.content}
          </p>
        </article>
      )}

      <section className="mt-8 border-t border-app-border pt-5">
        {!isLoading && (
          <div className="mb-5 flex items-center gap-1 text-sm text-app-text-muted">
            <button
              className={`app-btn app-btn-sm disabled:cursor-wait ${post.liked ? 'border border-app-primary/40 bg-app-primary/10 text-app-primary hover:bg-app-primary/18' : 'app-btn-outline'}`}
              type="button"
              aria-label={post.liked ? '좋아요 취소' : '좋아요'}
              aria-pressed={post.liked}
              disabled={isUpdatingLike}
              onClick={toggleLike}
            >
              <LikeIcon
                className={`size-[18px] ${post.liked ? 'fill-current' : ''}`}
              />
              <span>{post.likeCount}</span>
            </button>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 text-[13px] text-app-text-subtle"
              aria-label={`댓글 ${commentCount}`}
            >
              <CommentIcon className="size-[18px]" />
              <span>{commentCount}</span>
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 text-[13px] text-app-text-subtle"
              aria-label={`조회수 ${post.viewCount}`}
            >
              <ViewIcon className="size-[18px]" />
              <span>{post.viewCount}</span>
            </span>
          </div>
        )}

        <CommentForm
          className="mb-6"
          inputRef={commentInputRef}
          value={content}
          placeholder="이 기술에 대한 생각을 개발자국으로 남겨보세요"
          isPending={isCommentSubmitting}
          disabled={isLoading}
          submitLabel={isEditingComment ? '수정 등록' : '댓글 등록'}
          pendingLabel={isEditingComment ? '수정 중...' : '등록 중...'}
          onChange={changeContent}
          onSubmit={handleCommentSubmit}
          onCancel={
            isEditingComment ? () => setIsEditCancelModalOpen(true) : undefined
          }
        />

        <CommentList
          comments={isLoading ? null : comments}
          currentUser={currentUser}
          onEdit={startCommentEdit}
          onDelete={openDeleteCommentModal}
          onReply={startReply}
          onEditReply={startReplyEdit}
          onDeleteReply={openDeleteReplyModal}
          replyEditor={replyEditor}
          replyContent={replyContent}
          replyInputRef={replyInputRef}
          isReplySubmitting={isReplySubmitting}
          onReplyContentChange={changeReplyContent}
          onReplySubmit={submitReply}
          onReplyCancel={
            isEditingReply
              ? () => setIsEditCancelModalOpen(true)
              : resetReplyEditor
          }
        />
      </section>

      <ConfirmModal
        isOpen={isReportModalOpen}
        title="게시글을 신고하시겠습니까?"
        description="신고 사유를 선택해주세요."
        confirmLabel="신고"
        pendingLabel="신고 중..."
        isPending={isReporting}
        initialFocusRef={reportReasonInputRef}
        onCancel={closeReportModal}
        onConfirm={submitReport}
      >
        <fieldset className="flex flex-col gap-1" disabled={isReporting}>
          <legend className="sr-only">신고 사유</legend>
          {REPORT_REASON_OPTIONS.map((option, index) => (
            <label
              className="flex cursor-pointer items-center gap-2.5 rounded-md border border-transparent px-2 py-2 text-sm leading-6 text-app-text transition-colors hover:bg-app-surface-raised has-checked:border-app-primary/40 has-checked:bg-app-primary/10 has-disabled:cursor-not-allowed has-disabled:opacity-60"
              key={option.value}
            >
              <input
                className="size-4 shrink-0 accent-app-primary"
                ref={index === 0 ? reportReasonInputRef : undefined}
                type="radio"
                name="reportReason"
                value={option.value}
                checked={reportReason === option.value}
                onChange={changeReportReason}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </ConfirmModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        confirmLabel="확인"
        pendingLabel="삭제 중..."
        isPending={isDeletingPost}
        onCancel={closeDeleteModal}
        onConfirm={removePost}
      />

      <ConfirmModal
        isOpen={deletingCommentId != null}
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        isPending={isDeletingComment}
        onCancel={closeDeleteCommentModal}
        onConfirm={confirmDeleteComment}
      />

      <ConfirmModal
        isOpen={deletingReply != null}
        title="답글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구할 수 없습니다."
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        isPending={isDeletingReply}
        onCancel={closeDeleteReplyModal}
        onConfirm={confirmDeleteReply}
      />

      <ConfirmModal
        isOpen={isEditCancelModalOpen}
        title="수정을 취소하시겠습니까?"
        description="수정 중인 내용은 저장되지 않습니다."
        cancelLabel="계속 수정"
        confirmLabel="수정 취소"
        onCancel={() => {
          setIsEditCancelModalOpen(false)
          if (isEditingReply) {
            replyInputRef.current?.focus()
          } else {
            commentInputRef.current?.focus()
          }
        }}
        onConfirm={cancelActiveEdit}
      />
    </section>
  )
}

export default PostDetailPage
