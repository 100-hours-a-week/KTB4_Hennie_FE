import { useState } from 'react'

export const useReplyThreadVisibility = () => {
  const [expandedThreads, setExpandedThreads] = useState(() => new Set())

  const setExpanded = (commentId, expanded) => {
    const threadId = String(commentId)

    setExpandedThreads((current) => {
      const next = new Set(current)

      if (expanded) {
        next.add(threadId)
      } else {
        next.delete(threadId)
      }

      return next
    })
  }

  const isExpanded = (commentId) => expandedThreads.has(String(commentId))

  return {
    isExpanded,
    setExpanded,
  }
}
