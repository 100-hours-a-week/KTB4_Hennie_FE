import { formatDate } from '../utils/formatDate'
import { isOwnedByCurrentUser } from '../utils/isOwnedByCurrentUser'
import ReplyThread from './ReplyThread'

function CommentItem({
  comment,
  currentUser,
  isReplyThreadExpanded,
  showReplyThread,
  replyEditor,
  replyForm,
  onEdit,
  onDelete,
  onReply,
  onToggleReplyThread,
  onEditReply,
  onDeleteReply,
}) {
  const replies = Array.isArray(comment.replies) ? comment.replies : []
  const canManage = isOwnedByCurrentUser(comment, currentUser)
  const replyThreadId = `reply-thread-${comment.id}`

  return (
    <li className="flex flex-col gap-2 border-b border-app-border py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-[35px] shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
            <img
              className="size-full object-cover"
              src={comment.authorProfileUrl}
              alt="작성자"
            />
          </span>
          <span className="text-xs font-medium">{comment.authorNickname}</span>
          {comment.createdAt && (
            <time
              className="text-xs text-app-text-muted"
              dateTime={comment.createdAt}
            >
              {formatDate(comment.createdAt)}
            </time>
          )}
          {comment.edited && (
            <span className="text-xs text-app-text-muted">(수정됨)</span>
          )}
        </div>

        {!comment.deleted && comment.id != null && canManage && (
          <div className="flex shrink-0 gap-2">
            <button
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-3 text-xs font-medium text-app-text-muted hover:bg-app-surface-raised hover:text-app-text"
              type="button"
              onClick={() => onEdit(comment)}
            >
              수정
            </button>
            <button
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-3 text-xs font-medium text-app-text-muted hover:bg-app-surface-raised hover:text-app-text"
              type="button"
              onClick={() => onDelete(comment.id)}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <p className="pl-[43px] text-sm whitespace-pre-wrap">{comment.content}</p>

      {!comment.deleted && comment.id != null && (
        <div className="flex items-center gap-3 pl-[43px]">
          <button
            className="text-xs font-medium text-app-primary transition-colors hover:text-app-primary-hover focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            type="button"
            aria-expanded={isReplyThreadExpanded}
            aria-controls={replyThreadId}
            onClick={() => onReply(comment)}
          >
            답글
          </button>
          {replies.length > 0 && (
            <button
              className="text-xs text-app-text-muted transition-colors hover:text-app-text focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
              type="button"
              aria-expanded={isReplyThreadExpanded}
              aria-controls={replyThreadId}
              onClick={onToggleReplyThread}
            >
              {isReplyThreadExpanded
                ? `답글 ${replies.length}개 접기`
                : `답글 ${replies.length}개 보기`}
            </button>
          )}
        </div>
      )}

      {showReplyThread && (
        <ReplyThread
          comment={comment}
          replies={replies}
          currentUser={currentUser}
          editor={replyEditor}
          content={replyForm.content}
          inputRef={replyForm.inputRef}
          isSubmitting={replyForm.isSubmitting}
          onContentChange={replyForm.onContentChange}
          onSubmit={replyForm.onSubmit}
          onCancel={replyForm.onCancel}
          onReply={onReply}
          onEdit={onEditReply}
          onDelete={onDeleteReply}
        />
      )}
    </li>
  )
}

export default CommentItem
