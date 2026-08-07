import TechEnterpriseCard from './TechEnterpriseCard'

function TechEnterpriseSection({
  section,
  isSubscribed,
  onToggleSubscription,
  emptyMessage = '',
}) {
  const enterprises = Array.isArray(section.enterprises)
    ? section.enterprises
    : []
  const isEmpty = enterprises.length === 0

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

      {isEmpty && emptyMessage ? (
        <p className="rounded-xl border border-dashed border-app-border py-10 text-center text-sm text-app-text-muted">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {enterprises.map((enterprise) => (
            <TechEnterpriseCard
              enterprise={enterprise}
              isSubscribed={isSubscribed?.(enterprise.code)}
              key={enterprise.code}
              onToggle={onToggleSubscription}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TechEnterpriseSection
