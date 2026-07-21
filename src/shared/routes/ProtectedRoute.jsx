import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'

function ProtectedRoute() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/users/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
