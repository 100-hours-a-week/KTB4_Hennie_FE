import { Link } from 'react-router'
import { usePageTitle } from '../hook/usePageTitle'

function NotFoundPage({
  title = '페이지를 찾을 수 없습니다',
  description = '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
  to = '/posts',
  linkLabel = '목록으로 돌아가기',
}) {
  usePageTitle(title)

  return (
    <section
      className="mx-auto flex max-w-[560px] flex-col items-center px-6 py-24 text-center"
      role="alert"
    >
      <span
        className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-app-border bg-app-surface text-3xl"
        aria-hidden="true"
      >
        🐾
      </span>
      <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mb-8 text-sm leading-7 text-app-text-muted">
        {description}
      </p>
      <Link className="app-btn app-btn-primary app-btn-md" to={to}>
        {linkLabel}
      </Link>
    </section>
  )
}

export default NotFoundPage
