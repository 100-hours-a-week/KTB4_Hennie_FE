import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

export const useNavigateLogin = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.')
      navigate('/users/login')
      return false
    }

    return true
  }
}
