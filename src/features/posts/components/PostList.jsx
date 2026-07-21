import PostCard from './PostCard'

function PostList({ posts }) {
  const postItems = Array.isArray(posts) ? posts : []
  const isEmpty = Array.isArray(posts) && posts.length === 0

  return (
    <ul className="flex flex-col gap-4" aria-label="게시글 목록">
      {isEmpty && (
        <li className="py-6 text-center text-sm text-app-text-muted">
          게시글이 존재하지 않습니다.
        </li>
      )}

      {postItems.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  )
}

export default PostList
