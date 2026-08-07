import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { BellIcon, ChevronDownIcon, PawIcon } from './IconsList'
import { APP_NAME, DEFAULT_PROFILE_PATH, LOGO_PATH } from '../utils/constants'

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
            pathname === '/posts' ? 'text-app-primary' : 'text-app-text'
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
        <div className="absolute right-4 flex items-center gap-2 sm:right-6">
          <Link
            className="inline-flex size-10 items-center justify-center gap-1 rounded-full border border-app-text-muted px-0 text-sm font-semibold text-app-text-muted transition-colors hover:border-app-text hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary sm:h-9 sm:w-auto sm:px-4"
            to="/posts/write"
            aria-label="의견 작성"
            onClick={closeMenu}
          >
            <PawIcon className="size-[18px]" />
            <span className="hidden sm:inline">의견 작성</span>
          </Link>

          <Link
            className={`relative flex size-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary ${
              pathname === '/notifications'
                ? 'text-app-primary'
                : 'text-app-text-muted hover:text-app-text'
            }`}
            to="/notifications"
            aria-label="알림 센터"
            aria-current={pathname === '/notifications' ? 'page' : undefined}
            onClick={closeMenu}
          >
            <BellIcon className="size-5" />
          </Link>

          <div
            className="relative flex items-center gap-1"
            ref={profileMenuRef}
          >
            <img
              className="size-10 rounded-full object-cover"
              src={profileImage}
              alt={profileAlt}
            />
            <button
              className="flex size-8 items-center justify-center rounded-full text-app-text-muted transition-colors hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
              type="button"
              aria-label="사용자 메뉴"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-controls="profileMenu"
              onClick={toggleMenu}
            >
              <ChevronDownIcon
                className={`size-5 transition-transform duration-150 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
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
                마이페이지
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
