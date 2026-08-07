function Icon({ className = 'size-4', children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function LikeIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </Icon>
  )
}

export function CommentIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  )
}

export function ViewIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  )
}

export function ViewOffIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 21 21 3" />
    </Icon>
  )
}

export function BellIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  )
}

export function CheckIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="m20 6-11 11-5-5" />
    </Icon>
  )
}

export function ChevronDownIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  )
}

export function PawIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="5.5" cy="11" rx="1.8" ry="2.4" />
      <ellipse cx="10" cy="7.3" rx="1.9" ry="2.6" />
      <ellipse cx="14.5" cy="7.3" rx="1.9" ry="2.6" />
      <ellipse cx="18.5" cy="11" rx="1.8" ry="2.4" />
      <path d="M12 12.3c-2.7 0-5.1 2.2-5.1 4.8 0 1.8 1.4 3 3.2 3 .9 0 1.4-.35 1.9-.35s1 .35 1.9.35c1.8 0 3.2-1.2 3.2-3 0-2.6-2.4-4.8-5.1-4.8z" />
    </svg>
  )
}
