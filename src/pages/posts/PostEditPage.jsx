import { useParams } from 'react-router'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function PostEditPage() {
  usePageTitle('게시글 수정')

  const { postId } = useParams()

  return <div>PostEditPage — postId: {postId}</div>
}

export default PostEditPage
