import { toCount } from '../../../shared/utils/countValue'

export const normalizeTechArticle = (article = {}) => ({
  id: article.articleId ?? article.id ?? null,
  title: article.title || '제목 없음',
  enterprise: article.enterprise || '',
  originalUrl: article.originalUrl || '',
  publishedAt: article.publishedAt || '',
})

export const normalizeTechArticleList = (data = {}) => ({
  articles: (Array.isArray(data.articles) ? data.articles : []).map(
    normalizeTechArticle,
  ),
  pagination: {
    page: toCount(data.page) || 1,
    size: toCount(data.size) || 10,
    totalCount: toCount(data.totalCount),
    totalPages: toCount(data.totalPages) || 1,
    hasNext: Boolean(data.hasNext),
  },
})
