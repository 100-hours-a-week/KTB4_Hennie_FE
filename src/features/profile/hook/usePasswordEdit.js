import { useState } from 'react'
import { updatePassword } from '../api/profileApi'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import {
  PASSWORD_PATTERN,
  PWD_EMPTY_ERRORS,
} from '../../../shared/utils/constants'

const getServerFieldErrors = (error) => {
  const serverErrors = error?.body?.data?.errors

  if (!Array.isArray(serverErrors)) {
    return null
  }

  const fieldErrors = serverErrors.reduce((errors, { field, reason }) => {
    if ((field === 'currentPassword' || field === 'newPassword') && reason) {
      errors[field] = [errors[field], reason].filter(Boolean).join('\n')
    }

    return errors
  }, {})

  return Object.keys(fieldErrors).length ? fieldErrors : null
}

// 에러 메시지 매핑(getPasswordErrorMessage)은 페이지에서 정의해 주입받는다.
export const usePasswordEdit = ({ getPasswordErrorMessage }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState(PWD_EMPTY_ERRORS)
  const { run } = useAsyncLock()

  const changeField = (setter) => (event) => {
    setter(event.target.value)
    setErrors(PWD_EMPTY_ERRORS)
  }

  // 실제 저장 프리미티브. 성공 true / 실패 false(필드 에러 또는 alert 처리).
  const savePassword = () =>
    run(async () => {
      try {
        await updatePassword({ currentPassword, newPassword })
        setCurrentPassword('')
        setNewPassword('')
        setPasswordConfirm('')

        return true
      } catch (error) {
        const serverFieldErrors = getServerFieldErrors(error)

        if (serverFieldErrors) {
          setErrors({ ...PWD_EMPTY_ERRORS, ...serverFieldErrors })
          return false
        }

        const code = error?.code

        if (code === 'INVALID_CREDENTIALS') {
          setErrors({
            ...PWD_EMPTY_ERRORS,
            currentPassword: '현재 비밀번호가 일치하지 않습니다.',
          })
        } else if (code === 'SAME_AS_CURRENT_PASSWORD') {
          setErrors({
            ...PWD_EMPTY_ERRORS,
            newPassword: '현재 비밀번호와 다른 비밀번호를 입력해주세요.',
          })
        } else if (error?.status === 400) {
          setErrors({
            ...PWD_EMPTY_ERRORS,
            newPassword: '비밀번호를 다시 확인해주세요.',
          })
        } else {
          alert(getPasswordErrorMessage(error, '비밀번호 수정에 실패했습니다.'))
        }

        return false
      }
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors(PWD_EMPTY_ERRORS)

    if (!currentPassword) {
      setErrors({
        ...PWD_EMPTY_ERRORS,
        currentPassword: '현재 비밀번호를 입력해주세요.',
      })
      return
    }

    if (!PASSWORD_PATTERN.test(newPassword)) {
      setErrors({
        ...PWD_EMPTY_ERRORS,
        newPassword:
          '비밀번호는 영문 대·소문자, 숫자, 특수문자를 포함한 8~20자여야 합니다.',
      })
      return
    }

    if (newPassword !== passwordConfirm) {
      setErrors({
        ...PWD_EMPTY_ERRORS,
        passwordConfirm: '비밀번호가 일치하지 않습니다.',
      })
      return
    }

    if (await savePassword()) {
      alert('비밀번호가 수정되었습니다.')
    }
  }

  return {
    currentPassword,
    newPassword,
    passwordConfirm,
    errors,
    handleCurrentPasswordChange: changeField(setCurrentPassword),
    handleNewPasswordChange: changeField(setNewPassword),
    handlePasswordConfirmChange: changeField(setPasswordConfirm),
    handleSubmit,
  }
}
