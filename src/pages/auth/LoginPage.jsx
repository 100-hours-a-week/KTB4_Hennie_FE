import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'
import FormField from '../../shared/components/forms/FormField'
import PasswordField from '../../shared/components/forms/PasswordField'
import { usePageTitle } from '../../shared/hook/usePageTitle'

const getLoginErrorMessage = (error) => {
  if (error?.status === 400) {
    return '이메일과 비밀번호를 다시 확인해주세요.'
  }

  if (error?.status === 401 || error?.code === 'INVALID_CREDENTIALS') {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }

  if (error?.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
}

function LoginPage() {
  usePageTitle('로그인')

  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clearLoginError = () => {
    if (loginError) {
      setLoginError('')
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    clearLoginError()
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    clearLoginError()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setLoginError('')
    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate('/posts')
    } catch (error) {
      console.error('로그인 실패', error)
      setLoginError(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-start justify-center px-6 py-8">
      <div className="mt-8 flex w-full max-w-[400px] flex-col gap-6 rounded-lg border border-app-border bg-app-surface p-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl leading-tight font-bold">로그인</h1>
          <p className="text-base text-app-text-muted">
            개발이 남긴 발자국을 따라가다
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormField
            id="email"
            label="이메일"
            type="email"
            name="email"
            autoComplete="email"
            floating
            disabled={isSubmitting}
            value={email}
            onChange={handleEmailChange}
          />

          <PasswordField
            id="password"
            label="비밀번호"
            name="password"
            autoComplete="current-password"
            floating
            reserveMessageSpace
            disabled={isSubmitting}
            error={loginError}
            value={password}
            onChange={handlePasswordChange}
          />

          <button
            className="mt-2 h-[52px] w-full rounded-full bg-app-primary text-lg font-bold text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm text-app-text-muted">
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
          <span>또는</span>
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
        </div>

        <p className="text-center text-base text-app-text-muted">
          아직 개발바닥 회원이 아니신가요?{' '}
          <Link
            className="font-bold text-app-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            to="/users/signup"
          >
            회원가입
          </Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
