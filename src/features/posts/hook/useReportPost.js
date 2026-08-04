import { useRef, useState } from 'react'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { reportPost } from '../api/postApi'
import { isReportReason } from '../utils/reportReason'
import { useNavigateLogin } from './useNavigateLogin'

export const useReportPost = (postId) => {
  const requireLogin = useNavigateLogin()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const reportReasonInputRef = useRef(null)
  const { isRunning: isReporting, run } = useAsyncLock()

  const openReportModal = () => {
    if (!requireLogin()) {
      return
    }

    setIsReportModalOpen(true)
  }

  const closeReportModal = () => {
    if (isReporting) {
      return
    }

    setIsReportModalOpen(false)
    setReportReason('')
  }

  const changeReportReason = (event) => {
    setReportReason(event.target.value)
  }

  const submitReport = () => {
    const reason = reportReason

    if (!isReportReason(reason)) {
      alert('신고 사유를 선택해주세요.')
      reportReasonInputRef.current?.focus()
      return
    }

    return run(async () => {
      try {
        await reportPost(postId, { reason })
        setIsReportModalOpen(false)
        setReportReason('')
        alert('게시글이 신고되었습니다.')
      } catch (error) {
        console.error('게시글 신고 실패', error)

        if (error?.status === 404) {
          alert('게시글을 찾을 수 없습니다.')
        } else if (error?.status === 409) {
          alert('이미 신고한 게시글입니다.')
        } else {
          alert(
            getHttpErrorMessage(error, {
              forbidden: '본인의 게시글은 신고할 수 없습니다.',
              fallback: '게시글 신고에 실패했습니다.',
            }),
          )
        }
      }
    })
  }

  return {
    isReportModalOpen,
    reportReason,
    isReporting,
    reportReasonInputRef,
    openReportModal,
    closeReportModal,
    changeReportReason,
    submitReport,
  }
}
