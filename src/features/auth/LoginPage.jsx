import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../shared/api/client'
import { usePageTitle } from '../../shared/usePageTitle'
import { useAuth } from './context'

function LoginPage() {
  usePageTitle('로그인')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      await login({ email, password })
      navigate(location.state?.from?.pathname || '/posts', { replace: true })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, '로그인에 실패했습니다.'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default LoginPage
