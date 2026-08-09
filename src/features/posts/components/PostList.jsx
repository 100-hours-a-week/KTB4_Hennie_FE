import PostCard from './PostCard'
import EmptyListMessage from '../../../shared/components/EmptyListMessage'

const POST_LIST_LABEL = '게시글'

function PostList({ posts }) {
  const postItems = Array.isArray(posts) ? posts : []
  const isEmpty = Array.isArray(posts) && posts.length === 0

  return (
    <ul className="flex flex-col gap-3" aria-label={`${POST_LIST_LABEL} 목록`}>
      {isEmpty && <EmptyListMessage label={POST_LIST_LABEL} />}

      {postItems.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  )
}

export default PostList
