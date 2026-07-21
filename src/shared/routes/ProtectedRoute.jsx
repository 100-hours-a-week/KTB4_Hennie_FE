import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'

function ProtectedRoute() {
  const { currentUser, authStatus } = useAuth()

  if (authStatus === 'checking') {
    return null
  }

  if (authStatus !== 'authenticated' || !currentUser) {
    return <Navigate to="/users/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
