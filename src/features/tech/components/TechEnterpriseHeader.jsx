import { Link } from 'react-router'
import TechEnterpriseLogo from './TechEnterpriseLogo'

function TechEnterpriseHeader({ enterprise }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <TechEnterpriseLogo enterprise={enterprise} />

      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold">{enterprise.name}</h1>
        <a
          className="text-xs text-app-text-muted hover:text-app-primary"
          href={enterprise.href}
          target="_blank"
          rel="noreferrer"
        >
          기술 블로그 바로가기
        </a>
      </div>

      <Link
        className="ml-auto shrink-0 rounded-md border border-app-border px-3 py-1.5 text-xs font-medium text-app-text-muted hover:border-app-primary/50 hover:text-app-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
        to="/tech-enterprises"
      >
        기업 목록
      </Link>
    </div>
  )
}

export default TechEnterpriseHeader
