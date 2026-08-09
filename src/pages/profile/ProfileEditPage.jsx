import { useAuth } from '../../features/auth/hook/useAuth'
import { useProfileEdit } from '../../features/profile/hook/useProfileEdit'
import { useProfileComplete } from '../../features/profile/hook/useProfileComplete'
import { useWithdraw } from '../../features/profile/hook/useWithdraw'
import ConfirmModal from '../../shared/components/modal/ConfirmModal'
import FormField from '../../shared/components/forms/FormField'
import { DEFAULT_PROFILE_PATH } from '../../shared/utils/constants'
import { getHttpErrorMessage } from '../../shared/utils/httpErrorMessage'
import { usePageTitle } from '../../shared/hook/usePageTitle'

const getProfileErrorMessage = (error, fallback) =>
  getHttpErrorMessage(error, {
    forbidden: '회원정보를 변경할 권한이 없습니다.',
    fallback,
  })

function ProfileEditPage() {
  usePageTitle('회원정보수정')

  const { currentUser } = useAuth()

  // 회원 정보 수정
  const {
    nickname,
    previewUrl,
    imageError,
    isSaving,
    profileImageInputRef,
    handleNicknameChange,
    handleImageChange,
    handleSubmit,
    hasChanges,
    saveProfile,
  } = useProfileEdit({ getProfileErrorMessage })

  // 수정 완료
  const { completeProfile } = useProfileComplete({
    hasChanges,
    saveProfile,
    hasImageError: Boolean(imageError),
  })

  // 회원 정보 탈퇴
  const {
    isModalOpen: isWithdrawModalOpen,
    isWithdrawing,
    openModal: openWithdrawModal,
    closeModal: closeWithdrawModal,
    withdraw: handleWithdraw,
  } = useWithdraw({ getProfileErrorMessage })

  const profileImage =
    previewUrl || currentUser.profileUrl || DEFAULT_PROFILE_PATH
  const isBusy = isSaving || isWithdrawing

  return (
    <section className="flex min-h-[calc(100vh-4rem)] justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border border-app-border bg-app-surface p-7 shadow-card sm:p-9">
        <h1 className="text-center text-2xl font-bold">회원정보 수정</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span className="app-field-label">프로필 사진</span>
            <label
              className="group relative mx-auto mt-2 block size-[112px] cursor-pointer rounded-full bg-app-surface-raised ring-1 ring-app-border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="profile-image"
              aria-label="프로필 사진 변경"
            >
              <img
                className="size-full rounded-full object-cover"
                src={profileImage}
                alt={`${currentUser.nickname || '사용자'} 프로필`}
              />
              <span
                className="absolute right-0.5 bottom-0.5 flex size-8 items-center justify-center rounded-full border-2 border-app-surface bg-app-primary text-xl leading-none font-bold text-app-primary-ink transition-colors group-hover:bg-app-primary-hover"
                aria-hidden="true"
              >
                +
              </span>
              <input
                ref={profileImageInputRef}
                className="sr-only"
                id="profile-image"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={isBusy}
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
            readOnly
            value={currentUser.email}
          />

          <FormField
            id="nickname"
            label="닉네임"
            type="text"
            name="nickname"
            autoComplete="nickname"
            placeholder="수정할 닉네임"
            disabled={isBusy}
            value={nickname}
            onChange={handleNicknameChange}
          />

          <div className="mt-2 flex flex-col items-center gap-3">
            <button
              className="app-btn app-btn-primary app-btn-md w-full"
              type="submit"
              disabled={isBusy || Boolean(imageError)}
            >
              {isSaving ? '수정 중...' : '수정하기'}
            </button>

            <button
              className="rounded-md text-sm text-app-text-subtle underline underline-offset-4 transition-colors hover:text-app-error"
              type="button"
              disabled={isBusy}
              onClick={openWithdrawModal}
            >
              회원 탈퇴
            </button>

            <button
              className="app-btn app-btn-outline app-btn-md w-1/2 min-w-[140px]"
              type="button"
              disabled={isBusy || Boolean(imageError)}
              onClick={completeProfile}
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>

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

export default ProfileEditPage
