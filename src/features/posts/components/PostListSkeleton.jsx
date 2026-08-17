import { POST_LIST_SKELETON_COUNT } from '../../../shared/utils/constants'

function PostCardSkeleton() {
  return (
    <li className="app-list-row">
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="size-7 shrink-0 rounded-full bg-app-surface-raised" />
            <div className="h-3.5 w-20 rounded bg-app-surface-raised" />
            <div className="h-4 w-8 rounded-full bg-app-surface-raised" />
          </div>

          <div className="mb-2 flex flex-col gap-1.5">
            <div className="h-4 w-4/5 rounded bg-app-surface-raised" />
            <div className="h-4 w-2/5 rounded bg-app-surface-raised" />
          </div>

          <div className="mt-auto flex items-center gap-3">
            <div className="h-3.5 w-8 rounded bg-app-surface-raised" />
            <div className="h-3.5 w-8 rounded bg-app-surface-raised" />
            <div className="h-3.5 w-8 rounded bg-app-surface-raised" />
            <div className="ml-auto h-3.5 w-16 rounded bg-app-surface-raised" />
          </div>
        </div>

        <div className="aspect-video w-24 shrink-0 self-center rounded-lg bg-app-surface-raised sm:w-40" />
      </div>
    </li>
  )
}

function PostListSkeleton({ count = POST_LIST_SKELETON_COUNT }) {
  return (
    <ul className="app-list animate-pulse" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </ul>
  )
}

export default PostListSkeleton
