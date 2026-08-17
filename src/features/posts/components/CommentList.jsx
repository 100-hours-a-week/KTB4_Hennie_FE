import { useReplyThreadVisibility } from '../hook/comment/useReplyThreadVisibility'
import CommentItem from './CommentItem'

function CommentList({
  comments,
  currentUser,
  onEdit,
  onDelete,
  onReply,
  onEditReply,
  onDeleteReply,
  replyEditor,
  replyContent,
  replyInputRef,
  isReplySubmitting,
  onReplyContentChange,
  onReplySubmit,
  onReplyCancel,
}) {
  const { isExpanded, setExpanded } = useReplyThreadVisibility()

  const commentItems = Array.isArray(comments) ? comments : []

  if (Array.isArray(comments) && comments.length === 0) {
    return (
      <ul className="flex flex-col">
        <li className="app-empty">아직 댓글이 없습니다.</li>
      </ul>
    )
  }

  return (
    <ul className="flex flex-col">
      {commentItems.map((comment) => {
        const replies = Array.isArray(comment.replies) ? comment.replies : []
        const isReplyFormOpen =
          String(replyEditor?.commentId) === String(comment.id)
        const isReplyThreadExpanded = isExpanded(comment.id) || isReplyFormOpen
        const showReplyThread =
          isReplyFormOpen || (replies.length > 0 && isReplyThreadExpanded)

        const openReply = (target) => {
          setExpanded(comment.id, true)
          onReply?.(comment, target)
        }

        const openReplyEdit = (reply) => {
          setExpanded(comment.id, true)
          onEditReply?.(comment, reply)
        }

        const toggleReplyThread = () => {
          if (isReplyThreadExpanded && isReplyFormOpen) {
            onReplyCancel?.()
          }
          setExpanded(comment.id, !isReplyThreadExpanded)
        }

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            isReplyThreadExpanded={isReplyThreadExpanded}
            showReplyThread={showReplyThread}
            replyEditor={isReplyFormOpen ? replyEditor : null}
            replyForm={{
              content: replyContent,
              inputRef: replyInputRef,
              isSubmitting: isReplySubmitting,
              onContentChange: onReplyContentChange,
              onSubmit: onReplySubmit,
              onCancel: onReplyCancel,
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={openReply}
            onToggleReplyThread={toggleReplyThread}
            onEditReply={openReplyEdit}
            onDeleteReply={onDeleteReply}
          />
        )
      })}
    </ul>
  )
}

export default CommentList
