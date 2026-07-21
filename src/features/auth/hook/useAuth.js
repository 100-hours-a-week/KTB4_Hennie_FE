import { useContext } from 'react'
import AuthContext from './context'

// 상태 구독용 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  }

  return context
}
