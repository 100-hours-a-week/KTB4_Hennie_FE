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
    <section className="flex min-h-[calc(100vh-5rem)] justify-center px-6 py-8">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <h1 className="text-center text-2xl font-bold">회원정보 수정</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">프로필 사진</span>
            <label
              className="relative mx-auto mt-2 block size-[120px] cursor-pointer rounded-full bg-app-surface-raised focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-app-primary"
              htmlFor="profile-image"
              aria-label="프로필 사진 변경"
            >
              <img
                className="size-full rounded-full object-cover"
                src={profileImage}
                alt={`${currentUser.nickname || '사용자'} 프로필`}
              />
              <span
                className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full border-2 border-app-bg bg-app-primary text-xl leading-none font-bold text-white"
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
            <p className="min-h-4 text-center text-xs leading-[1.4] text-app-error">
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
              className="h-11 w-full rounded-md bg-app-primary px-4 text-base font-medium text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isBusy || Boolean(imageError)}
            >
              {isSaving ? '수정 중...' : '수정하기'}
            </button>

            <button
              className="text-sm text-app-text-muted underline hover:text-app-text focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
              type="button"
              disabled={isBusy}
              onClick={openWithdrawModal}
            >
              회원 탈퇴
            </button>

            <button
              className="h-[42px] w-1/2 min-w-[140px] rounded-full bg-app-primary text-base font-medium text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
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
