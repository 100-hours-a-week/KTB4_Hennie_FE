import TechEnterpriseLogo from './TechEnterpriseLogo'
import { getTechEnterprise } from '../utils/techEnterprises'
import { formatDate } from '../../../shared/utils/formatDate'
import { truncateText } from '../../../shared/utils/truncateText'
import { LIST_TITLE_MAX_LENGTH } from '../../../shared/utils/constants'

function TechArticleCard({ article }) {
  const enterprise = getTechEnterprise(article.enterprise)

  return (
    <li>
      <a
        className="app-list-row group cursor-pointer"
        href={article.originalUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="mb-1.5 flex items-center gap-2">
          <TechEnterpriseLogo
            enterprise={enterprise}
            className="size-5 p-0.5"
          />
          <span className="truncate text-xs font-medium text-app-text-muted">
            {enterprise?.name || article.enterprise}
          </span>
        </div>

        <h2
          className="mb-2 line-clamp-2 text-base leading-[1.45] font-semibold break-words text-app-text transition-colors duration-100 group-hover:text-app-primary sm:text-[17px]"
          title={article.title}
        >
          {truncateText(article.title, LIST_TITLE_MAX_LENGTH)}
        </h2>

        <div className="app-meta">
          <span className="text-app-text-muted">원문 보러 가기</span>
          <time
            className="ml-auto whitespace-nowrap"
            dateTime={article.publishedAt}
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </a>
    </li>
  )
}

export default TechArticleCard
