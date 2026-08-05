import { formatDate } from '../../../shared/utils/formatDate'
import { isOwnedByCurrentUser } from '../utils/isOwnedByCurrentUser'

function ReplyList({
  replies,
  currentUser,
  rootCommentId,
  onReply,
  onEdit,
  onDelete,
}) {
  if (replies.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col" aria-label="답글 목록">
      {replies.map((reply, index) => {
        const canManage = isOwnedByCurrentUser(reply, currentUser)

        return (
          <li
            className="relative flex gap-3 border-b border-app-border px-4 py-3 last:border-b-0"
            key={reply.id ?? `reply-${index}`}
          >
            <span
              className="mt-1 text-base leading-none text-app-text-muted"
              aria-hidden="true"
            >
              ↳
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="size-7 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
                    <img
                      className="size-full object-cover"
                      src={reply.authorProfileUrl}
                      alt=""
                    />
                  </span>
                  <span className="text-xs font-medium">
                    {reply.authorNickname}
                  </span>
                  {reply.createdAt && (
                    <time
                      className="text-[11px] text-app-text-muted"
                      dateTime={reply.createdAt}
                    >
                      {formatDate(reply.createdAt)}
                    </time>
                  )}
                  {reply.edited && (
                    <span className="text-[11px] text-app-text-muted">
                      (수정됨)
                    </span>
                  )}
                </div>

                {!reply.deleted && reply.id != null && (
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      className={
                        'inline-flex h-7 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-2.5 text-[11px] font-medium text-app-text-muted transition-colors hover:bg-app-surface-raised hover:text-app-text'
                      }
                      type="button"
                      onClick={() => onReply?.(reply)}
                    >
                      답글
                    </button>
                    {canManage && (
                      <>
                        <button
                          className="inline-flex h-7 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-2.5 text-[11px] font-medium text-app-text-muted transition-colors hover:bg-app-surface-raised hover:text-app-text"
                          type="button"
                          onClick={() => onEdit?.(reply)}
                        >
                          수정
                        </button>
                        <button
                          className="inline-flex h-7 items-center justify-center rounded-md border border-[#3a3e44] bg-app-surface px-2.5 text-[11px] font-medium text-app-text-muted transition-colors hover:bg-app-surface-raised hover:text-app-text"
                          type="button"
                          onClick={() => onDelete?.(rootCommentId, reply.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-2 text-sm whitespace-pre-wrap">
                {!reply.deleted && reply.replyTo && (
                  <>
                    <span
                      className={
                        reply.replyTo.deleted
                          ? 'font-medium text-app-text-muted'
                          : 'font-medium text-app-primary'
                      }
                    >
                      @{reply.replyTo.nickname}
                    </span>{' '}
                  </>
                )}
                {reply.content}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default ReplyList
