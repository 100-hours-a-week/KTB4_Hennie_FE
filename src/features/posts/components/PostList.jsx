import PostCard from './PostCard'
import EmptyListMessage from '../../../shared/components/EmptyListMessage'
import { POST_LIST_LABEL } from '../../../shared/utils/constants'

function PostList({ posts }) {
  const postItems = Array.isArray(posts) ? posts : []
  const isEmpty = Array.isArray(posts) && posts.length === 0

  return (
    <ul className="app-list" aria-label={`${POST_LIST_LABEL} 목록`}>
      {isEmpty && <EmptyListMessage label={POST_LIST_LABEL} />}

      {postItems.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  )
}

export default PostList
