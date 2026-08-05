const POST_THUMBNAILS = {
  FE: '/assets/thumbnail/thumbnail_fe.png',
  BE: '/assets/thumbnail/thumbnail_be.png',
  AI: '/assets/thumbnail/thumbnail_ai.png',
}

export const POST_CATEGORY_OPTIONS = [
  { value: 'FE', label: 'FE' },
  { value: 'BE', label: 'BE' },
  { value: 'AI', label: 'AI' },
]

export const getPostThumbnail = (category) => POST_THUMBNAILS[category]

export const getPostCategoryLabel = (category) =>
  POST_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? ''
