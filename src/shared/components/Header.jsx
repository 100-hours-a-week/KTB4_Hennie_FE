import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useNotification } from '../../features/notification/hook/useNotification'
import { BellIcon, ChevronDownIcon, PawIcon } from './IconsList'
import { APP_NAME, DEFAULT_PROFILE_PATH, LOGO_PATH } from '../utils/constants'

const NO_PROFILE_PATHS = new Set(['/users/login', '/users/signup'])

const MENU_ITEM_CLASS =
  'block w-full rounded-sm px-3 py-2 text-left text-[13px] font-medium text-app-text-muted transition-colors hover:bg-app-surface-hover hover:text-app-text focus-visible:bg-app-surface-hover focus-visible:text-app-text focus-visible:outline-none'

const NAV_LINK_CLASS =
  'block truncate rounded-md px-1.5 py-1.5 text-xs transition-colors duration-100 min-[360px]:text-[13px] sm:px-2.5 sm:text-sm'

const NAV_LINK_ACTIVE_CLASS = 'font-semibold text-app-text'

const NAV_LINK_INACTIVE_CLASS =
  'font-medium text-app-text-muted hover:bg-app-surface hover:text-app-text'

function Header({ currentUser = null, onLogout }) {
  const { pathname } = useLocation()
  const { unreadCount } = useNotification()
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
      className="h-7 w-auto object-contain min-[360px]:h-9 sm:h-11"
      src={LOGO_PATH}
      alt={APP_NAME}
    />
  )

  return (
    <header className="sticky top-0 z-[100] flex h-16 items-center gap-0.5 border-b border-app-border bg-app-bg px-2 min-[360px]:px-3 sm:gap-2 sm:px-6">
      {pathname === '/users/signup' ? (
        <span className="inline-flex shrink-0 items-center">{logoImage}</span>
      ) : (
        <Link
          className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-primary"
          to="/posts"
          aria-label={`${APP_NAME} 홈`}
          onClick={closeMenu}
        >
          {logoImage}
        </Link>
      )}

      <nav
        className="flex min-w-0 items-center min-[360px]:ml-1 sm:ml-4"
        aria-label="주요 메뉴"
      >
        <Link
          className={`${NAV_LINK_CLASS} ${
            pathname === '/posts'
              ? NAV_LINK_ACTIVE_CLASS
              : NAV_LINK_INACTIVE_CLASS
          }`}
          to="/posts"
          onClick={closeMenu}
        >
          개발 토론
        </Link>
      </nav>

      <nav className="flex min-w-0 items-center" aria-label="주요 메뉴">
        <Link
          className={`${NAV_LINK_CLASS} ${
            pathname === '/tech-enterprises'
              ? NAV_LINK_ACTIVE_CLASS
              : NAV_LINK_INACTIVE_CLASS
          }`}
          to="/tech-enterprises"
          onClick={closeMenu}
        >
          기술 원문
        </Link>
      </nav>

      {showProfile && currentUser && (
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
          <Link
            className="app-btn app-btn-primary size-8 px-0 sm:size-auto sm:h-8 sm:px-3"
            to="/posts/write"
            aria-label="의견 작성"
            onClick={closeMenu}
          >
            <PawIcon className="size-[18px]" />
            <span className="hidden sm:inline">의견 작성</span>
          </Link>

          <Link
            className={`relative flex size-8 shrink-0 items-center justify-center rounded-md transition-colors duration-100 ${
              pathname === '/notifications'
                ? 'bg-app-surface text-app-text'
                : 'text-app-text-muted hover:bg-app-surface hover:text-app-text'
            }`}
            to="/notifications"
            aria-label={
              unreadCount > 0
                ? `알림 센터, 읽지 않은 알림 ${unreadCount}개`
                : '알림 센터'
            }
            aria-current={pathname === '/notifications' ? 'page' : undefined}
            onClick={closeMenu}
          >
            <BellIcon className="size-5" />
            {unreadCount > 0 && (
              <span
                className="absolute top-0.5 right-0 flex min-w-4 items-center justify-center rounded-full border border-app-bg bg-app-error px-1 text-[10px] leading-4 font-bold text-app-error-ink"
                aria-hidden="true"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative flex items-center" ref={profileMenuRef}>
            <img
              className="size-7 rounded-full object-cover ring-1 ring-app-border sm:size-8"
              src={profileImage}
              alt={profileAlt}
            />
            <button
              className="flex size-6 items-center justify-center rounded-md text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text"
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
              className={`absolute top-[calc(100%+0.75rem)] right-0 min-w-40 rounded-md border border-app-border bg-app-surface-raised p-1 shadow-dropdown ${
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
        <div className="ml-auto shrink-0">
          <Link
            className="app-btn app-btn-outline app-btn-sm"
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
