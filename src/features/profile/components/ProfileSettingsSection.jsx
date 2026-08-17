import { useAuth } from '../../auth/hook/useAuth'
import ConfirmModal from '../../../shared/components/modal/ConfirmModal'
import FormField from '../../../shared/components/forms/FormField'
import { DEFAULT_PROFILE_PATH } from '../../../shared/utils/constants'
import { getHttpErrorMessage } from '../../../shared/utils/httpErrorMessage'
import { useProfileEdit } from '../hook/useProfileEdit'
import { useWithdraw } from '../hook/useWithdraw'

const getProfileErrorMessage = (error, fallback) =>
  getHttpErrorMessage(error, {
    forbidden: '회원정보를 변경할 권한이 없습니다.',
    fallback,
  })

function ProfileSettingsSection() {
  const { currentUser } = useAuth()
  const {
    nickname,
    previewUrl,
    imageError,
    isSaving,
    profileImageInputRef,
    handleNicknameChange,
    handleImageChange,
    handleSubmit,
  } = useProfileEdit({ getProfileErrorMessage })
  const {
    isModalOpen: isWithdrawModalOpen,
    isWithdrawing,
    openModal: openWithdrawModal,
    closeModal: closeWithdrawModal,
    withdraw: handleWithdraw,
  } = useWithdraw({ getProfileErrorMessage })

  const profileImage =
    previewUrl || currentUser?.profileUrl || DEFAULT_PROFILE_PATH
  const isBusy = isSaving || isWithdrawing

  return (
    <section
      className="scroll-mt-24"
      id="profile"
      aria-labelledby="profile-settings-title"
    >
      <div className="app-section-header">
        <h2 className="app-section-title" id="profile-settings-title">
          회원정보
        </h2>
        <p className="app-section-description">
          프로필 사진과 닉네임을 변경할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
          <div className="flex flex-col items-start gap-2">
            <span className="app-field-label">프로필 사진</span>
            <label
              className="group relative block size-24 cursor-pointer rounded-full bg-app-surface-raised focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="my-profile-image"
              aria-label="프로필 사진 변경"
            >
              <img
                className="size-full rounded-full object-cover"
                src={profileImage}
                alt={`${currentUser?.nickname || '사용자'} 프로필`}
                width={96}
                height={96}
              />
              <span
                className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-app-bg bg-app-primary text-base leading-none font-bold text-app-primary-ink transition-colors group-hover:bg-app-primary-hover"
                aria-hidden="true"
              >
                +
              </span>
              <input
                ref={profileImageInputRef}
                className="sr-only"
                id="my-profile-image"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png"
                disabled={isBusy}
                onChange={handleImageChange}
              />
            </label>
            <p className="min-h-4 text-xs leading-[1.5] text-app-error">
              {imageError}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              id="my-email"
              label="이메일"
              type="email"
              name="email"
              autoComplete="email"
              readOnly
              value={currentUser?.email || ''}
            />
            <FormField
              id="my-nickname"
              label="닉네임"
              type="text"
              name="nickname"
              autoComplete="nickname"
              placeholder="수정할 닉네임"
              disabled={isBusy}
              value={nickname}
              onChange={handleNicknameChange}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-app-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="self-center rounded-md text-sm text-app-text-subtle underline underline-offset-4 transition-colors hover:text-app-error sm:self-auto"
            type="button"
            disabled={isBusy}
            onClick={openWithdrawModal}
          >
            회원 탈퇴
          </button>
          <button
            className="app-btn app-btn-primary app-btn-md px-6"
            type="submit"
            disabled={isBusy || Boolean(imageError)}
          >
            {isSaving ? '저장 중...' : '회원정보 저장'}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isWithdrawModalOpen}
        title="회원탈퇴 하시겠습니까?"
        description="작성된 게시글과 댓글은 삭제됩니다."
        isPending={isWithdrawing}
        pendingLabel="탈퇴 중..."
        onCancel={closeWithdrawModal}
        onConfirm={handleWithdraw}
      />
    </section>
  )
}

export default ProfileSettingsSection
