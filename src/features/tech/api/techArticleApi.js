import { get } from '../../../shared/api/http'
import { normalizeTechArticleList } from '../utils/normalizeTechArticle'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../../shared/utils/constants'

export const getTechArticleList = async (
  { enterprise, page = DEFAULT_PAGE, size = DEFAULT_PAGE_SIZE } = {},
  options = {},
) => {
  const response = await get('/tech-articles', {
    ...options,
    auth: false,
    params: {
      ...(enterprise ? { enterprise } : {}),
      page,
      size,
    },
  })

  return normalizeTechArticleList(response?.data)
}
