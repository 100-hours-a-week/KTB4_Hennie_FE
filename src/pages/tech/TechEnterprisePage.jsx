import { usePageTitle } from '../../shared/hook/usePageTitle'
import { TECH_ENTERPRISE_SECTIONS } from '../../features/tech/utils/techEnterprises'

function TechEnterpriseCard({ enterprise }) {
  return (
    <a
      className="group flex flex-col items-center gap-3 rounded-xl border border-app-border bg-app-surface p-6 transition-[border-color,background-color] duration-200 hover:border-app-primary/50 hover:bg-app-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
      href={enterprise.href}
      target="_blank"
      rel="noreferrer"
    >
      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-app-surface-raised text-sm text-app-text-muted uppercase transition-transform duration-200 group-hover:scale-110">
        {enterprise.initials}
      </span>
      <span className="text-center text-sm font-medium text-app-text-muted transition-colors duration-200 group-hover:text-app-text">
        {enterprise.name}
      </span>
    </a>
  )
}

function TechEnterpriseSection({ section }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-app-text md:text-2xl">
          {section.emoji} {section.title}
        </h2>
        <p className="mt-1 text-sm text-app-text-muted">
          {section.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {section.enterprises.map((enterprise) => (
          <TechEnterpriseCard enterprise={enterprise} key={enterprise.code} />
        ))}
      </div>
    </section>
  )
}

function TechEnterprisePage() {
  usePageTitle('기술 원문')

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-24">
      <div className="mb-10">
        <p className="mb-6 text-center text-base leading-[1.6]">
          기업 <strong className="font-bold">개발</strong> 부서가 남긴 기술{' '}
          <strong className="font-bold">발자국</strong>을 따라
          <br />
          <strong className="font-bold">원문</strong>을
          읽어보세요...🐾
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {TECH_ENTERPRISE_SECTIONS.map((section) => (
          <TechEnterpriseSection section={section} key={section.id} />
        ))}
      </div>
    </div>
  )
}

export default TechEnterprisePage
