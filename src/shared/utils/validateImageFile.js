import { ALLOWED_IMAGE_TYPES, IMAGE_MAX_SIZE_BYTES } from './constants'

export const validateImageFile = (file) => {
  if (!file) {
    return ''
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'JPEG, PNG 형식의 이미지만 업로드할 수 있습니다.'
  }

  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    return '이미지 용량은 최대 10MB까지 업로드할 수 있습니다.'
  }

  return ''
}
