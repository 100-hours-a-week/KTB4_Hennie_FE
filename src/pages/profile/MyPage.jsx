import { useAuth } from '../../features/auth/hook/useAuth'
import PasswordSettingsSection from '../../features/profile/components/PasswordSettingsSection'
import ProfileSettingsSection from '../../features/profile/components/ProfileSettingsSection'
import SubscribedEnterpriseSection from '../../features/profile/components/SubscribedEnterpriseSection'
import { DEFAULT_PROFILE_PATH } from '../../shared/utils/constants'
import { usePageTitle } from '../../shared/hook/usePageTitle'

const MY_PAGE_SECTIONS = [
  { id: 'profile', label: '회원정보' },
  { id: 'password', label: '비밀번호 변경' },
  { id: 'subscriptions', label: '구독한 기업' },
]

function MyPage() {
  usePageTitle('마이페이지')
  const { currentUser } = useAuth()
  const profileImage = currentUser?.profileUrl || DEFAULT_PROFILE_PATH

  return (
    <section className="mx-auto w-full max-w-[1120px] px-6 py-8 pb-24">
      <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-app-border bg-app-surface p-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-3 border-b border-app-border pb-5 lg:flex-col lg:text-center">
            <span className="size-16 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
              <img
                className="size-full object-cover"
                src={profileImage}
                alt={`${currentUser?.nickname || '사용자'} 프로필`}
              />
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">
                {currentUser?.nickname || '사용자'}
              </p>
              <p className="mt-1 truncate text-xs text-app-text-muted">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <nav
            className="mt-3 flex gap-2 overflow-x-auto lg:flex-col"
            aria-label="마이페이지 메뉴"
          >
            {MY_PAGE_SECTIONS.map((section) => (
              <a
                className="shrink-0 rounded-md px-3 py-2 text-sm text-app-text-muted transition-colors hover:bg-app-surface-raised hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
                href={`#${section.id}`}
                key={section.id}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <ProfileSettingsSection />
          <PasswordSettingsSection />
          <SubscribedEnterpriseSection />
        </div>
      </div>
    </section>
  )
}

export default MyPage
