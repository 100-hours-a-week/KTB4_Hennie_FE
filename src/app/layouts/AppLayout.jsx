import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'
import Header from '../../shared/components/Header'
import LoadingPage from '../../pages/components/LoadingPage'

function AppLayout() {
  const navigate = useNavigate()
  const { currentUser, authStatus, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      alert('로그아웃 실패', error)
    } finally {
      navigate('/users/login')
    }
  }

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="min-h-[calc(100vh-5rem)]">
        {authStatus === 'checking' ? (
          <LoadingPage />
        ) : (
          <Outlet />
        )}
      </main>
    </>
  )
}

export default AppLayout
