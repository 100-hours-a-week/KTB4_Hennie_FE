import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'
import Header from '../../shared/components/Header'
import LoadingPage from '../../shared/components/LoadingPage'

function AppLayout() {
  const navigate = useNavigate()
  const { currentUser, authStatus, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // 서버 정리 실패와 무관하게 로컬은 이미 로그아웃 처리되어서 콘솔 에러만 띄우기
      console.error('로그아웃 실패', error)
    } finally {
      navigate('/users/login')
    }
  }

  if (authStatus === 'checking') {
    return <LoadingPage />
  }

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />{' '}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
