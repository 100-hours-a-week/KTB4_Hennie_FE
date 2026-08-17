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
      <div className="flex w-full max-w-[380px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">회원가입</h1>
          <p className="text-sm text-app-text-muted">
            개발바닥에서 나만의 개발자국을 남겨보세요
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <span className="app-field-label">프로필 사진</span>
            <label
              className="mx-auto flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-app-border-strong bg-app-surface text-2xl text-app-text-subtle transition-colors hover:border-app-text-subtle hover:text-app-text focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="profile-image"
            >
              {previewUrl ? (
                <img
                  className="size-full object-cover"
                  src={previewUrl}
                  alt="프로필 미리보기"
                  width={96}
                  height={96}
                />
              ) : (
                <span aria-hidden="true">+</span>
              )}
              <input
                className="sr-only"
                id="profile-image"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png"
                aria-describedby="profile-image-message"
                aria-invalid={Boolean(imageError)}
                disabled={isSubmitting}
                onChange={handleImageChange}
              />
            </label>
            <p
              className={`min-h-4 text-center text-xs leading-[1.5] ${
                imageError ? 'text-app-error' : 'text-app-text-muted'
              }`}
              id="profile-image-message"
              aria-live={imageError ? 'polite' : undefined}
            >
              {imageError || '선택 사항 · JPEG, PNG · 최대 10MB'}
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
            helperText="example@domain.com 형식으로 입력해주세요."
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
            helperText="8~20자, 대·소문자·숫자·특수문자를 포함해주세요."
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
            helperText="입력한 비밀번호를 한 번 더 입력해주세요."
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
            helperText="10자 이하, 공백 없이 입력해주세요."
            value={nickname}
            onChange={handleNicknameChange}
          />

          <button
            className="app-btn app-btn-primary app-btn-lg mt-1 w-full"
            type="submit"
            disabled={isSubmitting}
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
