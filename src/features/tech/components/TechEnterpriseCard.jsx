import { Link } from 'react-router'
import TechEnterpriseLogo from './TechEnterpriseLogo'

function TechEnterpriseCard({ enterprise }) {
  return (
      <Link
        className="group flex flex-col items-center gap-3 rounded-xl border border-app-border bg-app-surface p-6 transition-[border-color,background-color] duration-200 hover:border-app-primary/50 hover:bg-app-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
        to={`/tech-enterprises/${enterprise.slug || enterprise.code}`}
      >
        <TechEnterpriseLogo
          enterprise={enterprise}
          className="size-12 p-1.5 transition-transform duration-200 group-hover:scale-110"
        />
        <span className="text-center text-sm font-medium text-app-text-muted transition-colors duration-200 group-hover:text-app-text">
          {enterprise.name}
        </span>
      </Link>
  )
}

export default TechEnterpriseCard
