function LoadingPage({ message = '개발바닥 로딩중...🐾' }) {
  return (
    <div
      className="grid min-h-[inherit] place-items-center px-6 py-20"
      role="status"
      aria-live="polite"
    >
      <p className="app-loading">{message}</p>
    </div>
  )
}

export default LoadingPage
