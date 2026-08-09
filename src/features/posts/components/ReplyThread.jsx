import CommentForm from './CommentForm'
import ReplyList from './ReplyList'

function ReplyThread({
  comment,
  replies,
  currentUser,
  editor,
  content,
  inputRef,
  isSubmitting,
  onContentChange,
  onSubmit,
  onCancel,
  onReply,
  onEdit,
  onDelete,
}) {
  return (
    <section
      id={`reply-thread-${comment.id}`}
      className="mt-1.5 ml-11 overflow-hidden rounded-2xl border border-app-border bg-app-surface"
      aria-label={`${comment.authorNickname}님의 댓글에 달린 답글`}
    >
      <header className="flex items-center gap-2 border-b border-app-border bg-app-surface-raised px-4 py-2.5 text-xs text-app-text-muted">
        <span>
          <strong className="font-semibold text-app-text">
            {comment.authorNickname}
          </strong>
          님의 댓글에 달린 답글
        </span>
      </header>

      <ReplyList
        replies={replies}
        currentUser={currentUser}
        rootCommentId={comment.id}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {editor && (
        <div className="border-t border-app-border bg-app-surface-raised/40 p-3">
          <CommentForm
            inputRef={inputRef}
            inputId={`reply-${comment.id}`}
            name="reply"
            label={
              <>
                <span className="text-app-primary">@{editor.nickname}</span>
                님에게 {editor.mode === 'edit' ? '작성한 답글 수정' : '답글'}
              </>
            }
            placeholder="답글을 입력해주세요."
            value={content}
            isPending={isSubmitting}
            submitDisabled={!content.trim()}
            submitLabel={editor.mode === 'edit' ? '답글 수정' : '답글 등록'}
            pendingLabel={
              editor.mode === 'edit' ? '답글 수정 중...' : '답글 등록 중...'
            }
            onChange={onContentChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      )}
    </section>
  )
}

export default ReplyThread
