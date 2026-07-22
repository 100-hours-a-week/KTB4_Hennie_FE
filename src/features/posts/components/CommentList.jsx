import { formatDate } from '../utils/formatDate'
import { isOwnedByCurrentUser } from '../utils/isOwnedByCurrentUser'

function CommentList({ comments, currentUser, onEdit, onDelete }) {
  if (comments.length === 0) {
    return (
      <ul className="flex flex-col">
        <li className="py-6 text-center text-sm text-app-text-muted">
          아직 댓글이 없습니다.
        </li>
      </ul>
    )
  }

  return (
    <ul className="flex flex-col">
      {comments.map((comment) => {
        const canManage = isOwnedByCurrentUser(comment, currentUser)

        return (
          <li
            className="flex flex-col gap-2 border-b border-app-border py-4"
            key={comment.id}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-[35px] shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
                  <img
                    className="size-full object-cover"
                    src={comment.authorProfileUrl}
                    alt="작성자"
                  />
                </span>
                <span className="text-xs font-medium">
                  {comment.authorNickname}
                </span>
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
            <p className="pl-[43px] text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export default CommentList
