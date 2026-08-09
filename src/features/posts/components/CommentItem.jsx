import { formatDate } from '../../../shared/utils/formatDate'
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
    <li className="flex flex-col gap-2 border-b border-app-border py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="size-7 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
            <img
              className="size-full object-cover"
              src={comment.authorProfileUrl}
              alt="작성자"
            />
          </span>
          <span className="text-[13px] font-semibold">
            {comment.authorNickname}
          </span>
          {comment.createdAt && (
            <time
              className="text-xs text-app-text-subtle"
              dateTime={comment.createdAt}
            >
              {formatDate(comment.createdAt)}
            </time>
          )}
          {comment.edited && (
            <span className="text-xs text-app-text-subtle">(수정됨)</span>
          )}
        </div>

        {!comment.deleted && comment.id != null && canManage && (
          <div className="flex shrink-0 gap-2">
            <button
              className="app-btn app-btn-outline app-btn-xs"
              type="button"
              onClick={() => onEdit(comment)}
            >
              수정
            </button>
            <button
              className="app-btn app-btn-outline app-btn-xs"
              type="button"
              onClick={() => onDelete(comment.id)}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <p className="pl-9 text-sm leading-[1.75] whitespace-pre-wrap">
        {comment.content}
      </p>

      {!comment.deleted && comment.id != null && (
        <div className="flex items-center gap-3 pl-9">
          <button
            className="rounded-md text-xs font-semibold text-app-primary transition-colors hover:text-app-primary-hover"
            type="button"
            aria-expanded={isReplyThreadExpanded}
            aria-controls={replyThreadId}
            onClick={() => onReply(comment)}
          >
            답글
          </button>
          {replies.length > 0 && (
            <button
              className="rounded-md text-xs font-medium text-app-text-muted transition-colors hover:text-app-text"
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
