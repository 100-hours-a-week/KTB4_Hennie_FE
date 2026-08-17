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
    <section className="mx-auto w-full max-w-[960px] px-4 py-6 pb-20 sm:px-6 sm:py-8">
      <div className="grid items-start gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="border-b border-app-border pb-5 lg:sticky lg:top-20 lg:border-b-0 lg:pb-0">
          <div className="flex items-center gap-3 pb-4">
            <span className="size-10 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
              <img
                className="size-full object-cover"
                src={profileImage}
                alt={`${currentUser?.nickname || '사용자'} 프로필`}
                width={40}
                height={40}
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {currentUser?.nickname || '사용자'}
              </p>
              <p className="mt-1 truncate text-xs text-app-text-muted">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            aria-label="마이페이지 메뉴"
          >
            {MY_PAGE_SECTIONS.map((section) => (
              <a
                className="shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text"
                href={`#${section.id}`}
                key={section.id}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-10">
          <ProfileSettingsSection />
          <PasswordSettingsSection />
          <SubscribedEnterpriseSection />
        </div>
      </div>
    </section>
  )
}

export default MyPage
