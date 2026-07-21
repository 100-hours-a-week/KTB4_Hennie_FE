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
            className="mt-2 h-[52px] w-full rounded-full bg-app-primary text-lg font-bold text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            type="submit"
          >
            로그인
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
