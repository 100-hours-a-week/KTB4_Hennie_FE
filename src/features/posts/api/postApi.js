import { get } from '../../../shared/api/http'
import { normalizePostList } from '../utils/normalizePost'
import {DEFAULT_POST_PAGE_SIZE} from '../../../shared/constants'

const DEFAULT_POST_PAGE = 1

export const getPostList = async (
  { page = DEFAULT_POST_PAGE, size = DEFAULT_POST_PAGE_SIZE } = {},
  options = {},
) => {
  const response = await get('/posts', {
    ...options,
    params: {
      page,
      size,
    },
  })

  return normalizePostList(response?.data)
}
