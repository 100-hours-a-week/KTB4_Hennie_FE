import { usePageTitle } from '../../shared/hook/usePageTitle'

function NotificationCenterPage() {
  usePageTitle('알림 센터')

  return (
    <section className="mx-auto w-full max-w-[720px] px-6 py-8 pb-24">
      <header className="mb-6 pb-5">
        <h1 className="text-2xl font-bold sm:text-3xl">알림 센터</h1>
        <p className="mt-2 text-sm text-app-text-muted">
          새로운 개발자취(활동)과 구독한 기업의 개발 소식을 확인하세요.
        </p>
      </header>

      <div className="rounded-xl px-6 py-14 text-center">
        <h2 className="text-base font-bold">새로운 알림이 없습니다.</h2>
      </div>
    </section>
  )
}

export default NotificationCenterPage
