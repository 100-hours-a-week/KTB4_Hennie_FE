import { Link } from 'react-router'
import { usePageTitle } from '../shared/usePageTitle'

function NotFoundPage() {
  usePageTitle('페이지를 찾을 수 없습니다')

  return (
    <section>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소가 잘못되었거나 삭제된 페이지입니다.</p>
      <Link to="/posts">게시글 목록으로 돌아가기</Link>
    </section>
  )
}

export default NotFoundPage
