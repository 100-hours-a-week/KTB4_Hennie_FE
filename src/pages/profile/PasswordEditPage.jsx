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
    <section className="flex min-h-[calc(100vh-5rem)] justify-center px-6 py-8">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
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
            className="mt-2 h-11 w-full rounded-md bg-app-primary px-4 text-base font-medium text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
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
