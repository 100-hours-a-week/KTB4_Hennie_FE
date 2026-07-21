function LoadingPage() {
  return (
    <div
      className="grid min-h-[inherit]"
      role="status"
      aria-live="polite"
    >
      <p className="py-6 text-center text-sm text-app-text-muted">개발바닥 로딩중...🐾</p>
    </div>
  )
}

export default LoadingPage
