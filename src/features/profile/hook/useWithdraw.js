import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'
import { withdrawMyInfo } from '../api/profileApi'

export const useWithdraw = ({ getProfileErrorMessage }) => {
  const navigate = useNavigate()
  const { clearAuthSession } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  // 중복 제출 방지용(state는 비동기라 같은 tick 연타를 못 막으므로 ref로 가드)
  const isWithdrawingRef = useRef(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const withdraw = async () => {
    if (isWithdrawingRef.current) {
      return
    }

    isWithdrawingRef.current = true
    setIsWithdrawing(true)

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
    } finally {
      isWithdrawingRef.current = false
      setIsWithdrawing(false)
    }
  }

  return {
    isModalOpen,
    isWithdrawing,
    openModal,
    closeModal,
    withdraw,
  }
}
