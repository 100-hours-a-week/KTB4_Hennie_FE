import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/context'
import { APP_NAME } from '../shared/config'

const NO_PROFILE_PATHS = ['/users/login', '/users/signup']

function Header() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const showProfile = !NO_PROFILE_PATHS.includes(pathname)

  const handleLogout = async () => {
    await logout()
    navigate('/users/login')
  }

  return (
    <header className="header">
      {pathname === '/users/signup' ? (
        <span className="header__logo">{APP_NAME}</span>
      ) : (
        <Link className="header__logo" to="/posts" aria-label="개발바닥 홈">
          {APP_NAME}
        </Link>
      )}
      {showProfile && (
        <nav className="header__menu">
          {user ? (
            <>
              <Link to="/users/myInfo">회원정보 수정</Link>
              <Link to="/users/myInfo/password">비밀번호 수정</Link>
              <button type="button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/users/login">로그인</Link>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
