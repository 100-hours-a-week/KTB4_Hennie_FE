import { Link } from 'react-router'
import {
  LikeIcon,
  CommentIcon,
  ViewIcon,
} from '../../../shared/components/IconsList'
import { formatDate } from '../../../shared/utils/formatDate'
import { truncateText } from '../../../shared/utils/truncateText'
import { LIST_TITLE_MAX_LENGTH } from '../../../shared/utils/constants'
import { getPostCategoryLabel, getPostThumbnail } from '../utils/postCategory'

function PostStat({ label, count, children }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-app-text-muted"
      aria-label={`${label} ${count}`}
    >
      {children}
      {count}
    </span>
  )
}

function PostCard({ post }) {
  return (
    <li>
      <Link
        className="block cursor-pointer overflow-hidden rounded-lg border border-app-border bg-app-surface px-6 py-4 shadow-[0_1px_3px_rgb(0_0_0/40%)] transition-[box-shadow,border-color,background-color] duration-150 hover:border-[#3a3e44] hover:bg-app-surface-raised hover:shadow-dropdown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
        to={`/posts/${post.id}`}
      >
        <div className="flex gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="size-8 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
                <img
                  className="size-full object-cover"
                  src={post.authorProfileUrl}
                  alt="작성자"
                />
              </span>
              <span className="truncate text-base font-medium text-app-text">
                {post.authorNickname}
              </span>
              {getPostCategoryLabel(post.category) && (
                <span className="ml-auto shrink-0 rounded-md bg-app-surface-raised px-2 py-0.5 text-xs font-medium text-app-primary">
                  {getPostCategoryLabel(post.category)}
                </span>
              )}
            </div>

            <h2
              className="mb-4 line-clamp-2 text-base leading-[1.4] font-bold break-words"
              title={post.title}
            >
              {truncateText(post.title, LIST_TITLE_MAX_LENGTH)}
            </h2>

            <div className="mt-auto flex items-center gap-4 border-t border-app-border pt-3">
              <PostStat label="좋아요" count={post.likeCount}>
                <LikeIcon />
              </PostStat>
              <PostStat label="댓글" count={post.commentCount}>
                <CommentIcon />
              </PostStat>
              <PostStat label="조회수" count={post.viewCount}>
                <ViewIcon />
              </PostStat>
              <time
                className="ml-auto whitespace-nowrap text-xs text-app-text-muted"
                dateTime={post.createdAt}
              >
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          <img
            className="-mr-3 aspect-video w-32 shrink-0 self-center rounded-md bg-app-surface-raised object-cover sm:w-44"
            src={getPostThumbnail(post.category)}
            alt=""
          />
        </div>
      </Link>
    </li>
  )
}

export default PostCard
