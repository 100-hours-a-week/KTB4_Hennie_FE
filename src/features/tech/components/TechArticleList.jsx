import TechArticleCard from './TechArticleCard'
import EmptyListMessage from '../../../shared/components/EmptyListMessage'
import { TECH_ARTICLE_LIST_LABEL } from '../../../shared/utils/constants'

function TechArticleList({ articles }) {
  const articleItems = Array.isArray(articles) ? articles : []
  const isEmpty = Array.isArray(articles) && articles.length === 0

  return (
    <ul className="app-list" aria-label={`${TECH_ARTICLE_LIST_LABEL} 목록`}>
      {isEmpty && <EmptyListMessage label={TECH_ARTICLE_LIST_LABEL} />}

      {articleItems.map((article) => (
        <TechArticleCard key={article.id} article={article} />
      ))}
    </ul>
  )
}

export default TechArticleList
