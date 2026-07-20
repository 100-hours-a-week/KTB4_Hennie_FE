function LoadingMessage({ message = '불러오는 중...' }) {
  return <p role="status">{message}</p>
}

export default LoadingMessage
