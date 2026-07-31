import { useState } from 'react'

// 댓글 배열 로컬 캐시
// 게시글 (재)조회로 comments 배열 참조가 바뀔 때만 서버 값으로 재시드한다.
export const useComments = (post) => {
  const initialComments = post?.comments
  const [comments, setComments] = useState(() => initialComments ?? [])
  const [seededComments, setSeededComments] = useState(initialComments)

  if (initialComments !== seededComments) {
    setSeededComments(initialComments)
    setComments(initialComments ?? [])
  }

  // 등록: 응답으로 받은 댓글을 append. 롤백은 방금 추가분 제거.
  const addComment = (comment) => {
    if (comment?.id == null) {
      return () => {}
    }

    setComments((prev) => [...prev, comment])
    return () => setComments((prev) => prev.filter((item) => item !== comment))
  }

  // 삭제: id로 제거. 롤백은 같은 위치에 되돌리기.
  const removeComment = (id) => {
    let removed = null
    let index = -1

    setComments((prev) => {
      index = prev.findIndex((item) => String(item.id) === String(id))
      removed = index >= 0 ? prev[index] : null
      return index >= 0 ? prev.filter((_, i) => i !== index) : prev
    })

    return () => {
      if (!removed) {
        return
      }

      setComments((prev) => {
        const next = [...prev]
        next.splice(index, 0, removed)
        return next
      })
    }
  }

  // 수정: id 항목에 patch 병합. 롤백은 이전 값으로 복원.
  const updateComment = (id, patch) => {
    let previous = null

    setComments((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          previous = item
          return { ...item, ...patch }
        }

        return item
      }),
    )

    return () => {
      if (!previous) {
        return
      }

      setComments((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? previous : item)),
      )
    }
  }

  const addReply = (commentId, reply) => {
    if (reply?.id == null) {
      return () => {}
    }

    setComments((prev) =>
      prev.map((comment) =>
        String(comment.id) === String(commentId)
          ? {
              ...comment,
              replies: [...(comment.replies || []), reply],
            }
          : comment,
      ),
    )

    return () => {
      setComments((prev) =>
        prev.map((comment) =>
          String(comment.id) === String(commentId)
            ? {
                ...comment,
                replies: (comment.replies || []).filter(
                  (item) => item !== reply,
                ),
              }
            : comment,
        ),
      )
    }
  }

  const updateReply = (commentId, replyId, patch) => {
    let previous = null

    setComments((prev) =>
      prev.map((comment) => {
        if (String(comment.id) !== String(commentId)) {
          return comment
        }

        return {
          ...comment,
          replies: (comment.replies || []).map((reply) => {
            if (String(reply.id) === String(replyId)) {
              previous = reply
              return { ...reply, ...patch }
            }

            return reply
          }),
        }
      }),
    )

    return () => {
      if (!previous) {
        return
      }

      setComments((prev) =>
        prev.map((comment) =>
          String(comment.id) === String(commentId)
            ? {
                ...comment,
                replies: (comment.replies || []).map((reply) =>
                  String(reply.id) === String(replyId) ? previous : reply,
                ),
              }
            : comment,
        ),
      )
    }
  }

  const commentCount = comments.reduce(
    (count, comment) => count + 1 + (comment.replies?.length || 0),
    0,
  )

  return {
    comments,
    commentCount,
    addComment,
    removeComment,
    updateComment,
    addReply,
    updateReply,
  }
}
