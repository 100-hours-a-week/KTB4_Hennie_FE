function TechEnterpriseLogo({ enterprise, className = 'size-12 p-1.5' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
    >
      <img
        className="size-full object-contain"
        src={enterprise?.logoUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
    </span>
  )
}

export default TechEnterpriseLogo
