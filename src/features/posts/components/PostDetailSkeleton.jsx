function PostDetailSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="mb-6 border-b border-app-border pb-5">
        <div className="mb-2.5 h-6 w-14 rounded-full bg-app-surface-raised" />
        <div className="mb-2 h-7 w-3/4 rounded bg-app-surface-raised sm:h-8" />

        <div className="mt-4 flex items-center gap-2">
          <div className="size-8 shrink-0 rounded-full bg-app-surface-raised" />
          <div className="h-4 w-20 rounded bg-app-surface-raised" />
          <div className="h-4 w-24 rounded bg-app-surface-raised" />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-2.5">
        <div className="h-4 w-full rounded bg-app-surface-raised" />
        <div className="h-4 w-full rounded bg-app-surface-raised" />
        <div className="h-4 w-2/3 rounded bg-app-surface-raised" />
      </div>
    </div>
  )
}

export default PostDetailSkeleton
