import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'
import { LOGIN_REQUIRED_MESSAGE } from '../../../shared/utils/constants'

export const useNavigateLogin = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return () => {
    if (!currentUser) {
      alert(LOGIN_REQUIRED_MESSAGE)
      navigate('/users/login')
      return false
    }

    return true
  }
}
