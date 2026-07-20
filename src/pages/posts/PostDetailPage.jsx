import { useParams } from 'react-router'
import { usePageTitle } from '../../shared/usePageTitle'

function PostDetailPage() {
  usePageTitle('게시글')

  const { postId } = useParams()

  return <div>PostDetailPage — postId: {postId}</div>
}

export default PostDetailPage
