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
        className="app-card app-card-interactive group block cursor-pointer overflow-hidden p-4 sm:p-5"
        href={article.originalUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="mb-2.5 flex items-center gap-2">
          <TechEnterpriseLogo enterprise={enterprise} className="size-7 p-1" />
          <span className="truncate text-[13px] font-medium text-app-text-muted">
            {enterprise?.name || article.enterprise}
          </span>
        </div>

        <h2
          className="mb-4 line-clamp-2 text-[17px] leading-[1.45] font-bold break-words transition-colors duration-150 group-hover:text-app-primary sm:text-lg"
          title={article.title}
        >
          {truncateText(article.title, LIST_TITLE_MAX_LENGTH)}
        </h2>

        <div className="flex items-center gap-4 border-t border-app-border pt-3">
          <span className="text-xs font-semibold text-app-primary">
            원문 보러 가기
          </span>
          <time
            className="ml-auto whitespace-nowrap text-xs text-app-text-subtle"
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
