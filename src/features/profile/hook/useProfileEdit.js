import { useRef, useState } from 'react'
import { useAuth } from '../../auth/hook/useAuth'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { updateMyInfo } from '../api/profileApi'

// 닉네임 중복/검증 에러 판별 (useProfileEdit 전용)
const isNicknameError = (error) =>
  error?.status === 409 || error?.code === 'NICKNAME_ALREADY_EXISTS'

// getProfileErrorMessage는 탈퇴 흐름과 공유하므로 페이지에서 주입받는다.
export const useProfileEdit = ({ getProfileErrorMessage }) => {
  const { currentUser, updateCurrentUser } = useAuth()

  const [nickname, setNickname] = useState(currentUser?.nickname || '')
  const savedNicknameRef = useRef(currentUser?.nickname?.trim() || '')
  const { run } = useAsyncLock()

  const handleNicknameChange = (event) => {
    setNickname(event.target.value)
  }

  const hasChanges = () => nickname.trim() !== savedNicknameRef.current

  const saveNickname = () =>
    run(async () => {
      const trimmedNickname = nickname.trim()

      try {
        const updatedUser = await updateMyInfo({ nickname: trimmedNickname })
        const nextNickname = updatedUser?.nickname ?? trimmedNickname

        updateCurrentUser(updatedUser)
        setNickname(nextNickname)
        savedNicknameRef.current = nextNickname.trim() || trimmedNickname

        return true
      } catch (error) {
        console.error('회원정보 수정 실패', error)

        setNickname(savedNicknameRef.current)

        if (isNicknameError(error)) {
          alert(
            error?.code === 'NICKNAME_ALREADY_EXISTS'
              ? '이미 사용 중인 닉네임입니다.'
              : '닉네임을 다시 확인해주세요.',
          )
        } else {
          alert(getProfileErrorMessage(error, '회원정보 수정에 실패했습니다.'))
        }

        return false
      }
    })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!hasChanges()) {
      alert('변경된 회원정보가 없습니다.')
      return
    }

    if (await saveNickname()) {
      alert('회원정보가 수정되었습니다.')
    }
  }

  return {
    nickname,
    handleNicknameChange,
    handleSubmit,
    hasChanges,
    saveNickname,
  }
}
