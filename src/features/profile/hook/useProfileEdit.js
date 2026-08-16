import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../auth/hook/useAuth'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { validateImageFile } from '../../../shared/utils/validateImageFile'
import { updateMyInfo } from '../api/profileApi'
import { API_ERROR_CODE } from '../../../shared/utils/apiErrorCode'

// 닉네임 중복/검증 에러 판별 (useProfileEdit 전용)
const isNicknameError = (error) =>
  error?.status === 409 ||
  error?.code === API_ERROR_CODE.NICKNAME_ALREADY_EXISTS

// getProfileErrorMessage는 탈퇴 흐름과 공유하므로 페이지에서 주입받는다.
export const useProfileEdit = ({ getProfileErrorMessage }) => {
  const { currentUser, updateCurrentUser } = useAuth()

  const [nickname, setNickname] = useState(currentUser?.nickname || '')
  const [profileImage, setProfileImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const savedNicknameRef = useRef(currentUser?.nickname?.trim() || '')
  const profileImageInputRef = useRef(null)
  const { isRunning: isSaving, run } = useAsyncLock()

  const previewUrl = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : ''),
    [profileImage],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleNicknameChange = (event) => {
    setNickname(event.target.value)
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    const validationError = validateImageFile(file)

    if (validationError) {
      setImageError(validationError)
      setProfileImage(null)
      event.target.value = ''
      return
    }

    setImageError('')
    setProfileImage(file)
  }

  const hasChanges = () =>
    nickname.trim() !== savedNicknameRef.current || Boolean(profileImage)

  const saveProfile = () =>
    run(async () => {
      const trimmedNickname = nickname.trim()

      try {
        const updatedUser = await updateMyInfo({
          nickname: trimmedNickname,
          profileImage,
        })
        const nextNickname = updatedUser?.nickname ?? trimmedNickname

        updateCurrentUser(updatedUser)
        setNickname(nextNickname)
        setProfileImage(null)
        setImageError('')
        savedNicknameRef.current = nextNickname.trim() || trimmedNickname

        if (profileImageInputRef.current) {
          profileImageInputRef.current.value = ''
        }

        return true
      } catch (error) {
        console.error('회원정보 수정 실패', error)

        setNickname(savedNicknameRef.current)

        if (isNicknameError(error)) {
          alert(
            error?.code === API_ERROR_CODE.NICKNAME_ALREADY_EXISTS
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

    if (imageError) {
      return
    }

    if (await saveProfile()) {
      alert('회원정보가 수정되었습니다.')
    }
  }

  return {
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
  }
}
