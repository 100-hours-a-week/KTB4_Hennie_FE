import TechEnterpriseCard from './TechEnterpriseCard'

function TechEnterpriseSection({ section }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-app-text md:text-2xl">
          {section.title}
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

export default TechEnterpriseSection
