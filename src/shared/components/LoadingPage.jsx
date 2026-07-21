function LoadingPage({ message = '개발바닥 로딩중...🐾' }) {
  return (
    <div className="grid min-h-[inherit]" role="status" aria-live="polite">
      <p className="py-6 text-center text-sm text-app-text-muted">{message}</p>
    </div>
  )
}

export default LoadingPage
