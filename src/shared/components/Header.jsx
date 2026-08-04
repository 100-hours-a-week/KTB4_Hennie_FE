import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { APP_NAME, LOGO_PATH, DEFAULT_PROFILE_PATH } from '../utils/constants'

const NO_PROFILE_PATHS = new Set(['/users/login', '/users/signup'])

const MENU_ITEM_CLASS =
  'block w-full border-t border-app-border px-4 py-3 text-left text-sm text-app-text first:border-t-0 hover:bg-app-bg focus-visible:bg-app-bg focus-visible:outline-none'

function Header({ currentUser = null, onLogout }) {
  const { pathname } = useLocation()
  const profileMenuRef = useRef(null)
  const [openPathname, setOpenPathname] = useState(null)

  const showProfile = !NO_PROFILE_PATHS.has(pathname)
  const isMenuOpen = openPathname === pathname
  const profileImage = currentUser?.profileUrl || DEFAULT_PROFILE_PATH
  const profileAlt = currentUser?.nickname
    ? `${currentUser.nickname} 프로필`
    : '프로필'

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const closeMenu = () => setOpenPathname(null)
    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        closeMenu()
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setOpenPathname(null)
  const toggleMenu = () => {
    setOpenPathname((currentPathname) =>
      currentPathname === pathname ? null : pathname,
    )
  }
  const handleLogout = async () => {
    closeMenu()
    await onLogout?.()
  }

  const logoImage = (
    <img
      className="h-20 w-auto object-contain"
      src={LOGO_PATH}
      alt={APP_NAME}
    />
  )

  return (
    <header className="sticky top-0 z-[100] flex h-20 items-center border-b border-app-border bg-app-bg/50 px-4 backdrop-blur-md sm:px-6">
      {pathname === '/users/signup' ? (
        <span className="inline-flex items-center">{logoImage}</span>
      ) : (
        <Link
          className="inline-flex items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
          to="/posts"
          aria-label={`${APP_NAME} 홈`}
          onClick={closeMenu}
        >
          {logoImage}
        </Link>
      )}

      <nav className="ml-6 flex items-center" aria-label="주요 메뉴">
        <Link
          className={`rounded-sm px-2 py-1 text-sm font-semibold transition-colors duration-150 hover:text-app-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary ${
            pathname === '/posts'
              ? 'text-app-primary'
              : 'text-app-text'
          }`}
          to="/posts"
          onClick={closeMenu}
        >
          개발 토론
        </Link>
      </nav>

      <nav className="ml-6 flex items-center" aria-label="주요 메뉴">
        <Link
          className={`rounded-sm px-2 py-1 text-sm font-semibold transition-colors duration-150 hover:text-app-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary ${
            pathname === '/tech-enterprises'
              ? 'text-app-primary'
              : 'text-app-text'
          }`}
          to="/tech-enterprises"
          onClick={closeMenu}
        >
          기술 원문
        </Link>
      </nav>

      {showProfile && currentUser && (
        <div className="absolute right-4 sm:right-6" ref={profileMenuRef}>
          <button
            className="block size-[50px] overflow-hidden rounded-full bg-app-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            type="button"
            aria-label="프로필 메뉴"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-controls="profileMenu"
            onClick={toggleMenu}
          >
            <img
              className="size-full object-cover"
              src={profileImage}
              alt={profileAlt}
            />
          </button>

          <nav
            className={`absolute top-[calc(100%+0.5rem)] right-0 min-w-40 overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-dropdown ${
              isMenuOpen ? 'block' : 'hidden'
            }`}
            id="profileMenu"
            aria-label="사용자 메뉴"
          >
            <Link
              className={MENU_ITEM_CLASS}
              to="/users/myInfo"
              onClick={closeMenu}
            >
              회원정보 수정
            </Link>
            <Link
              className={MENU_ITEM_CLASS}
              to="/users/myInfo/password"
              onClick={closeMenu}
            >
              비밀번호 수정
            </Link>
            <button
              className={MENU_ITEM_CLASS}
              type="button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </nav>
        </div>
      )}

      {showProfile && !currentUser && (
        <div className="absolute right-4 sm:right-6">
          <Link
            className="rounded-sm px-2 py-1 font-semibold text-app-text hover:text-app-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            to="/users/login"
          >
            로그인
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
