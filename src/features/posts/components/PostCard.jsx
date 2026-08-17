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
      className="inline-flex items-center gap-1"
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
      <Link className="app-list-row group" to={`/posts/${post.id}`}>
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="size-7 shrink-0 overflow-hidden rounded-full bg-app-surface-raised">
                <img
                  className="size-full object-cover"
                  src={post.authorProfileUrl}
                  alt="작성자"
                  width={28}
                  height={28}
                />
              </span>
              <span className="truncate text-[13px] font-medium text-app-text-muted">
                {post.authorNickname}
              </span>
              {getPostCategoryLabel(post.category) && (
                <span className={`app-chip app-chip-${post.category}`}>
                  {getPostCategoryLabel(post.category)}
                </span>
              )}
            </div>

            <h2
              className="mb-2 line-clamp-2 text-base leading-[1.45] font-semibold break-words text-app-text transition-colors duration-100 group-hover:text-app-primary sm:text-[17px]"
              title={post.title}
            >
              {truncateText(post.title, LIST_TITLE_MAX_LENGTH)}
            </h2>

            <div className="app-meta mt-auto gap-3">
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
                className="ml-auto whitespace-nowrap"
                dateTime={post.createdAt}
              >
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          <img
            className="aspect-video w-24 shrink-0 self-center rounded-lg border border-app-border bg-app-surface-raised object-cover sm:w-40"
            src={getPostThumbnail(post.category)}
            alt=""
            width={320}
            height={180}
          />
        </div>
      </Link>
    </li>
  )
}

export default PostCard
