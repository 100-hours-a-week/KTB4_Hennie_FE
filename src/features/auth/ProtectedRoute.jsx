import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './context'

function ProtectedRoute() {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <div>로그인 상태를 확인하는 중...</div>
  }

  if (!user) {
    return <Navigate to="/users/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
