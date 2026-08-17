const DEFAULT_POST_THUMBNAIL = '/assets/thumbnail/thumbnail_default.webp'

const POST_THUMBNAILS = {
  FE: '/assets/thumbnail/thumbnail_fe.webp',
  BE: '/assets/thumbnail/thumbnail_be.webp',
  AI: '/assets/thumbnail/thumbnail_ai.webp',
}

export const POST_CATEGORY_OPTIONS = [
  { value: 'FE', label: 'FE' },
  { value: 'BE', label: 'BE' },
  { value: 'AI', label: 'AI' },
]

export const getPostThumbnail = (category) =>
  POST_THUMBNAILS[category] ?? DEFAULT_POST_THUMBNAIL

export const getPostCategoryLabel = (category) =>
  POST_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? ''
