import { useRef, useState } from 'react'
import { UNKNOWN_AUTHOR_NAME } from '../../../../shared/utils/constants'

export const useReplyEditor = ({
  createReply,
  updateReply,
  isCreatingReply,
  isUpdatingReply,
  onStart,
}) => {
  const inputRef = useRef(null)
  const [editor, setEditor] = useState(null)
  const [content, setContent] = useState('')

  const isCreating = editor?.mode === 'create'
  const isEditing = editor?.mode === 'edit'
  const isSubmitting = isCreatingReply || isUpdatingReply

  const focusEditor = (nextContent = '') => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(
        nextContent.length,
        nextContent.length,
      )
      inputRef.current?.closest('form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  const reset = () => {
    setEditor(null)
    setContent('')
  }

  const startCreate = (comment, target) => {
    onStart?.()
    setEditor({
      mode: 'create',
      commentId: comment.id,
      replyToId: target.id,
      nickname: target.authorNickname,
    })
    setContent('')
    focusEditor()
  }

  const startEdit = (comment, reply) => {
    onStart?.()
    setEditor({
      mode: 'edit',
      commentId: comment.id,
      replyId: reply.id,
      nickname: reply.replyTo?.nickname || UNKNOWN_AUTHOR_NAME,
    })
    setContent(reply.content)
    focusEditor(reply.content)
  }

  const changeContent = (event) => {
    setContent(event.target.value)
  }

  const submit = async (event) => {
    event.preventDefault()

    if (isCreating) {
      const created = await createReply({
        commentId: editor.commentId,
        replyToId: editor.replyToId,
        content,
      })

      if (created) {
        reset()
      }
      return
    }

    if (isEditing) {
      const updated = await updateReply({
        commentId: editor.commentId,
        replyId: editor.replyId,
        content,
      })

      if (updated) {
        reset()
      }
    }
  }

  return {
    inputRef,
    editor,
    content,
    isCreating,
    isEditing,
    isSubmitting,
    startCreate,
    startEdit,
    changeContent,
    submit,
    reset,
  }
}
