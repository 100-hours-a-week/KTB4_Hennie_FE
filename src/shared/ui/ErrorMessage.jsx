function ErrorMessage({ message = '요청에 실패했습니다.', onRetry }) {
  return (
    <div role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
