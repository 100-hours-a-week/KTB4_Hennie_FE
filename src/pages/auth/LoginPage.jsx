import { Link } from 'react-router'
import { useLogin } from '../../features/auth/hook/useLogin'
import FormField from '../../shared/components/forms/FormField'
import PasswordField from '../../shared/components/forms/PasswordField'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function LoginPage() {
  usePageTitle('로그인')

  const {
    email,
    password,
    loginError,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLogin()

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="flex w-full max-w-[380px] flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold">로그인</h1>
          <p className="text-sm text-app-text-muted">
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
            error={loginError}
            value={password}
            onChange={handlePasswordChange}
          />

          <button
            className="app-btn app-btn-primary app-btn-lg mt-1 w-full"
            type="submit"
          >
            로그인
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-app-text-subtle">
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
          <span>또는</span>
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
        </div>

        <p className="text-center text-sm text-app-text-muted">
          아직 개발바닥 회원이 아니신가요?{' '}
          <Link
            className="rounded-sm font-bold text-app-primary hover:underline"
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
