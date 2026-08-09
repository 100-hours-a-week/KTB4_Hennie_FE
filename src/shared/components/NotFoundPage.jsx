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
      className="mx-auto flex max-w-[520px] flex-col items-center px-6 py-20 text-center"
      role="alert"
    >
      <h1 className="mb-2 text-xl font-bold">{title}</h1>
      <p className="mb-6 text-sm leading-7 text-app-text-muted">
        {description}
      </p>
      <Link className="app-btn app-btn-outline app-btn-sm" to={to}>
        {linkLabel}
      </Link>
    </section>
  )
}

export default NotFoundPage
