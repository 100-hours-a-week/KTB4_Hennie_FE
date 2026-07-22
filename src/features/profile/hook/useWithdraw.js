import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { withdrawMyInfo } from '../api/profileApi'

export const useWithdraw = ({ getProfileErrorMessage }) => {
  const navigate = useNavigate()
  const { clearAuthSession } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isRunning: isWithdrawing, run } = useAsyncLock()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const withdraw = () =>
    run(async () => {
      try {
        await withdrawMyInfo()
        clearAuthSession()
        setIsModalOpen(false)
        alert('회원 탈퇴가 완료되었습니다.')
        navigate('/users/login', { replace: true })
      } catch (error) {
        console.error('회원 탈퇴 실패', error)
        setIsModalOpen(false)
        alert(getProfileErrorMessage(error, '회원 탈퇴에 실패했습니다.'))
      }
    })

  return {
    isModalOpen,
    isWithdrawing,
    openModal,
    closeModal,
    withdraw,
  }
}
