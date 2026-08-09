import TechEnterpriseCard from './TechEnterpriseCard'

function TechEnterpriseSection({
  section,
  isSubscribed,
  isSubscriptionPending,
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
          {enterprises.map((enterprise) => {
            const subscribed = isSubscribed?.(enterprise.code) ?? false

            return (
              <TechEnterpriseCard
                enterprise={enterprise}
                isSubscribed={subscribed}
                isSubscriptionPending={isSubscriptionPending?.(enterprise.code)}
                key={enterprise.code}
                onToggle={onToggleSubscription}
                subscriptionDisabled={
                  enterprise.id == null ||
                  (!subscribed && enterprise.isActive !== true)
                }
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TechEnterpriseSection
