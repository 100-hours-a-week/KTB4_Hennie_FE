import { Link, useLocation } from 'react-router'

const APP_NAME = '개발바닥'
const NO_PROFILE_PATHS = ['/users/login', '/users/signup']

function Header() {
  const { pathname } = useLocation()
  const showProfile = !NO_PROFILE_PATHS.includes(pathname)

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
          <Link to="/users/login">로그인</Link>
        </nav>
      )}
    </header>
  )
}

export default Header
