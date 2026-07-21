import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'

function GuestOnlyRoute() {
  const { currentUser } = useAuth()

  if (currentUser) {
    return <Navigate to="/posts" replace />
  }

  return <Outlet />
}

export default GuestOnlyRoute
