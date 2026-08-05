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
        className="block cursor-pointer overflow-hidden rounded-lg border border-app-border bg-app-surface px-6 py-4 shadow-[0_1px_3px_rgb(0_0_0/40%)] transition-[box-shadow,border-color,background-color] duration-150 hover:border-[#3a3e44] hover:bg-app-surface-raised hover:shadow-dropdown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
        href={article.originalUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="mb-3 flex items-center gap-2">
          <TechEnterpriseLogo enterprise={enterprise} className="size-8 p-1" />
          <span className="truncate text-base font-medium text-app-text">
            {enterprise?.name || article.enterprise}
          </span>
        </div>

        <h2
          className="mb-4 line-clamp-2 text-base leading-[1.4] font-bold break-words"
          title={article.title}
        >
          {truncateText(article.title, LIST_TITLE_MAX_LENGTH)}
        </h2>

        <div className="flex items-center gap-4 border-t border-app-border pt-3">
          <span className="text-xs text-app-primary">원문 보러 가기</span>
          <time
            className="ml-auto whitespace-nowrap text-xs text-app-text-muted"
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
