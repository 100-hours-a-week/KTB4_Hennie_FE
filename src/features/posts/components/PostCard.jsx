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
      className="inline-flex items-center gap-1.5 text-xs font-medium text-app-text-muted"
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
        className="app-card app-card-interactive group block overflow-hidden p-4 sm:p-5"
        to={`/posts/${post.id}`}
      >
        <div className="flex gap-4 sm:gap-5">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="size-7 shrink-0 overflow-hidden rounded-full bg-app-surface-raised ring-1 ring-app-border">
                <img
                  className="size-full object-cover"
                  src={post.authorProfileUrl}
                  alt="작성자"
                />
              </span>
              <span className="truncate text-[13px] font-medium text-app-text-muted">
                {post.authorNickname}
              </span>
              {getPostCategoryLabel(post.category) && (
                <span className="app-chip ml-auto">
                  {getPostCategoryLabel(post.category)}
                </span>
              )}
            </div>

            <h2
              className="mb-4 line-clamp-2 text-[17px] leading-[1.45] font-bold break-words transition-colors duration-150 group-hover:text-app-primary sm:text-lg"
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
                className="ml-auto whitespace-nowrap text-xs text-app-text-subtle"
                dateTime={post.createdAt}
              >
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          <img
            className="aspect-video w-24 shrink-0 self-center rounded-xl border border-app-border bg-app-surface-raised object-cover sm:w-40"
            src={getPostThumbnail(post.category)}
            alt=""
          />
        </div>
      </Link>
    </li>
  )
}

export default PostCard
