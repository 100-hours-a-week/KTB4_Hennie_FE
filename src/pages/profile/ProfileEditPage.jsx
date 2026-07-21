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
    handleNicknameChange,
    handleSubmit,
    hasChanges,
    saveNickname,
  } = useProfileEdit({ getProfileErrorMessage })

  // 수정 완료
  const { completeProfile } = useProfileComplete({ hasChanges, saveNickname })

  // 회원 정보 탈퇴
  const {
    isModalOpen: isWithdrawModalOpen,
    isWithdrawing,
    openModal: openWithdrawModal,
    closeModal: closeWithdrawModal,
    withdraw: handleWithdraw,
  } = useWithdraw({ getProfileErrorMessage })

  const profileImage = currentUser.profileUrl || DEFAULT_PROFILE_PATH

  return (
    <section className="flex min-h-[calc(100vh-5rem)] justify-center px-6 py-8">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <h1 className="text-center text-2xl font-bold">회원정보수정</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">프로필 사진</span>
            <div className="mx-auto mt-2 size-[120px] overflow-hidden rounded-full bg-app-surface-raised">
              <img
                className="size-full object-cover"
                src={profileImage}
                alt={`${currentUser.nickname || '사용자'} 프로필`}
              />
            </div>
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
            disabled={isWithdrawing}
            value={nickname}
            onChange={handleNicknameChange}
          />

          <div className="mt-2 flex flex-col items-center gap-3">
            <button
              className="h-11 w-full rounded-md bg-app-primary px-4 text-base font-medium text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isWithdrawing}
            >
              수정하기
            </button>

            <button
              className="text-sm text-app-text-muted underline hover:text-app-text focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary"
              type="button"
              disabled={isWithdrawing}
              onClick={openWithdrawModal}
            >
              회원 탈퇴
            </button>

            <button
              className="h-[42px] w-1/2 min-w-[140px] rounded-full bg-app-primary text-base font-medium text-white transition-colors hover:bg-app-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-primary disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isWithdrawing}
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
