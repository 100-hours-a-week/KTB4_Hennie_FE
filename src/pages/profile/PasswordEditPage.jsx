import { usePasswordEdit } from '../../features/profile/hook/usePasswordEdit'
import { getHttpErrorMessage } from '../../shared/utils/httpErrorMessage'
import PasswordField from '../../shared/components/forms/PasswordField'
import { usePageTitle } from '../../shared/hook/usePageTitle'

const getPasswordErrorMessage = (error, fallback) =>
  getHttpErrorMessage(error, {
    forbidden: '비밀번호를 변경할 권한이 없습니다.',
    fallback,
  })

function PasswordEditPage() {
  usePageTitle('비밀번호 수정')

  const {
    currentPassword,
    newPassword,
    passwordConfirm,
    errors,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
  } = usePasswordEdit({ getPasswordErrorMessage })

  return (
    <section className="flex min-h-[calc(100vh-4rem)] justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border border-app-border bg-app-surface p-7 shadow-card sm:p-9">
        <h1 className="text-center text-2xl font-bold">비밀번호 수정</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <PasswordField
            id="current-password"
            label="현재 비밀번호"
            name="currentPassword"
            autoComplete="current-password"
            placeholder="현재 비밀번호를 입력하세요"
            reserveMessageSpace
            error={errors.currentPassword}
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />

          <PasswordField
            id="new-password"
            label="새 비밀번호"
            name="newPassword"
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력하세요"
            reserveMessageSpace
            error={errors.newPassword}
            value={newPassword}
            onChange={handleNewPasswordChange}
          />

          <PasswordField
            id="password-confirm"
            label="새 비밀번호 확인"
            name="passwordConfirm"
            autoComplete="new-password"
            placeholder="비밀번호를 한번 더 입력하세요"
            reserveMessageSpace
            error={errors.passwordConfirm}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />

          <button
            className="app-btn app-btn-primary app-btn-md mt-2 w-full"
            type="submit"
          >
            수정하기
          </button>
        </form>
      </div>
    </section>
  )
}

export default PasswordEditPage
