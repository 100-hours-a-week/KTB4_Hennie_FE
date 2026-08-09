import PasswordField from '../../../shared/components/forms/PasswordField'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { usePasswordEdit } from '../hook/usePasswordEdit'

const getPasswordErrorMessage = (error, fallback) =>
  getHttpErrorMessage(error, {
    forbidden: '비밀번호를 변경할 권한이 없습니다.',
    fallback,
  })

function PasswordSettingsSection() {
  const {
    currentPassword,
    newPassword,
    passwordConfirm,
    errors,
    isSaving,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
  } = usePasswordEdit({ getPasswordErrorMessage })

  return (
    <section
      className="app-panel scroll-mt-20"
      id="password"
      aria-labelledby="password-settings-title"
    >
      <div className="app-panel-header">
        <h2 className="app-panel-title" id="password-settings-title">
          비밀번호 변경
        </h2>
        <p className="app-panel-description">
          현재 비밀번호를 확인한 후 새 비밀번호로 변경합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex max-w-md flex-col gap-3">
            <PasswordField
              id="my-current-password"
              label="현재 비밀번호"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="현재 비밀번호를 입력하세요"
              reserveMessageSpace
              disabled={isSaving}
              error={errors.currentPassword}
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
            <PasswordField
              id="my-new-password"
              label="새 비밀번호"
              name="newPassword"
              autoComplete="new-password"
              placeholder="새 비밀번호를 입력하세요"
              reserveMessageSpace
              disabled={isSaving}
              error={errors.newPassword}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <PasswordField
              id="my-password-confirm"
              label="새 비밀번호 확인"
              name="passwordConfirm"
              autoComplete="new-password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              reserveMessageSpace
              disabled={isSaving}
              error={errors.passwordConfirm}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
            />
          </div>
        </div>

        <div className="mt-2 grid gap-6 border-t border-app-border pt-5 md:grid-cols-[160px_minmax(0,1fr)]">
          <div className="hidden md:block" aria-hidden="true" />
          <div className="flex justify-end">
            <button
              className="app-btn app-btn-primary app-btn-md px-6"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default PasswordSettingsSection
