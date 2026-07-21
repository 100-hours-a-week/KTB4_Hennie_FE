import { Link, useNavigate } from 'react-router'
import { useSignup } from '../../features/auth/hook/useSignup'
import FormField from '../../shared/components/forms/FormField'
import PasswordField from '../../shared/components/forms/PasswordField'
import { usePageTitle } from '../../shared/hook/usePageTitle'

function SignupPage() {
  usePageTitle('회원가입')

  const navigate = useNavigate()
  const {
    email,
    password,
    passwordConfirm,
    nickname,
    errors,
    isFormValid,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleNicknameChange,
    handleSubmit,
  } = useSignup({ navigate })

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-start justify-center px-6 py-8">
      <div className="mt-8 flex w-full max-w-[400px] flex-col gap-6 rounded-lg border border-app-border bg-app-surface p-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl leading-tight font-bold">회원가입</h1>
          <p className="text-base text-app-text-muted">
            개발바닥에서 나만의 개발자국을 남겨보세요
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">프로필 사진</span>
            <label
              className="mx-auto flex size-[120px] cursor-pointer items-center justify-center rounded-full bg-app-surface-raised text-4xl text-app-text-muted transition-colors hover:bg-app-border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="profile-image"
            >
              <span aria-hidden="true">+</span>
              <input
                className="sr-only"
                id="profile-image"
                type="file"
                accept="image/*"
                disabled={isSubmitting}
              />
            </label>
          </div>

          <FormField
            id="email"
            label="이메일"
            type="email"
            name="email"
            autoComplete="email"
            floating
            reserveMessageSpace
            disabled={isSubmitting}
            error={errors.email}
            value={email}
            onChange={handleEmailChange}
          />

          <PasswordField
            id="password"
            label="비밀번호"
            name="password"
            autoComplete="new-password"
            floating
            reserveMessageSpace
            disabled={isSubmitting}
            error={errors.password}
            value={password}
            onChange={handlePasswordChange}
          />

          <PasswordField
            id="password-confirm"
            label="비밀번호 확인"
            name="passwordConfirm"
            autoComplete="new-password"
            floating
            reserveMessageSpace
            disabled={isSubmitting}
            error={errors.passwordConfirm}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />

          <FormField
            id="nickname"
            label="닉네임"
            type="text"
            name="nickname"
            autoComplete="nickname"
            floating
            reserveMessageSpace
            disabled={isSubmitting}
            error={errors.nickname}
            value={nickname}
            onChange={handleNicknameChange}
          />

          <button
            className="mt-2 h-[52px] w-full rounded-full bg-app-primary text-lg font-bold text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:bg-app-surface-raised disabled:text-app-text-muted"
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm text-app-text-muted">
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
          <span>또는</span>
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
        </div>

        <p className="text-center text-base text-app-text-muted">
          이미 개발바닥 회원이세요?{' '}
          <Link
            className="font-bold text-app-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
            to="/users/login"
          >
            로그인
          </Link>
        </p>
      </div>
    </section>
  )
}

export default SignupPage
