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
    previewUrl,
    imageError,
    isFormValid,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleNicknameChange,
    handleImageChange,
    handleSubmit,
  } = useSignup({ navigate })

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border border-app-border bg-app-surface p-7 shadow-modal sm:p-9">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-tight font-bold">회원가입</h1>
          <p className="text-sm text-app-text-muted">
            개발바닥에서 나만의 개발자국을 남겨보세요
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span className="app-field-label">프로필 사진</span>
            <label
              className="mx-auto flex size-[112px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-app-border-strong bg-app-bg-sunken text-3xl text-app-text-subtle transition-colors hover:border-app-primary/60 hover:text-app-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="profile-image"
            >
              {previewUrl ? (
                <img
                  className="size-full object-cover"
                  src={previewUrl}
                  alt="프로필 미리보기"
                />
              ) : (
                <span aria-hidden="true">+</span>
              )}
              <input
                className="sr-only"
                id="profile-image"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={isSubmitting}
                onChange={handleImageChange}
              />
            </label>
            <p className="min-h-4 text-center text-xs leading-[1.5] text-app-error">
              {imageError}
            </p>
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
            className="app-btn app-btn-primary app-btn-lg mt-1 w-full text-base"
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-app-text-subtle">
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
          <span>또는</span>
          <span className="h-px flex-1 bg-app-border" aria-hidden="true" />
        </div>

        <p className="text-center text-sm text-app-text-muted">
          이미 개발바닥 회원이세요?{' '}
          <Link
            className="rounded-sm font-bold text-app-primary hover:underline"
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
