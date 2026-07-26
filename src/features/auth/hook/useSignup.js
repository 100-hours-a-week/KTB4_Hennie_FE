import { useEffect, useMemo, useState } from 'react'
import { signup } from '../api/authApi'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { validateImageFile } from '../../../shared/utils/validateImageFile'
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  NICKNAME_MAX_LENGTH,
  SIGNUP_EMPTY_ERRORS,
} from '../../../shared/utils/constants'

const isNicknameValid = (nickname) =>
  Boolean(nickname) &&
  nickname.length <= NICKNAME_MAX_LENGTH &&
  !/\s/.test(nickname)

const getServerFieldErrors = (error) => {
  const serverErrors = error?.body?.data?.errors

  if (!Array.isArray(serverErrors)) {
    return null
  }

  const fieldErrors = serverErrors.reduce((errors, { field, reason }) => {
    if (Object.hasOwn(SIGNUP_EMPTY_ERRORS, field) && reason) {
      errors[field] = [errors[field], reason].filter(Boolean).join('\n')
    }

    return errors
  }, {})

  return Object.keys(fieldErrors).length ? fieldErrors : null
}

export const useSignup = ({ navigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [nickname, setNickname] = useState('')
  const [errors, setErrors] = useState(SIGNUP_EMPTY_ERRORS)
  const [profileImage, setProfileImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const { isRunning: isSubmitting, run } = useAsyncLock()

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

  const trimmedEmail = email.trim()
  const trimmedNickname = nickname.trim()
  const isFormValid =
    EMAIL_PATTERN.test(trimmedEmail) &&
    PASSWORD_PATTERN.test(password) &&
    password === passwordConfirm &&
    isNicknameValid(trimmedNickname) &&
    !imageError

  const changeField = (field, setter) => (event) => {
    setter(event.target.value)
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: '',
      passwordConfirm: '',
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    setErrors(SIGNUP_EMPTY_ERRORS)

    return run(async () => {
      try {
        await signup({
          email: trimmedEmail,
          password,
          nickname: trimmedNickname,
          profileImage,
        })

        alert('회원가입에 성공했습니다.')
        navigate('/users/login')
      } catch (error) {
        console.error('회원가입 실패', error)

        const serverFieldErrors = getServerFieldErrors(error)

        if (serverFieldErrors) {
          setErrors({ ...SIGNUP_EMPTY_ERRORS, ...serverFieldErrors })
          return
        }

        if (error?.code === 'EMAIL_ALREADY_EXISTS') {
          setErrors({
            ...SIGNUP_EMPTY_ERRORS,
            email: '이미 사용중인 이메일입니다.',
          })
        } else if (error?.code === 'NICKNAME_ALREADY_EXISTS') {
          setErrors({
            ...SIGNUP_EMPTY_ERRORS,
            nickname: '이미 사용중인 닉네임입니다.',
          })
        } else {
          alert('회원가입에 실패했습니다.')
        }
      }
    })
  }

  const passwordConfirmError =
    errors.passwordConfirm ||
    (password && passwordConfirm && password !== passwordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : '')

  return {
    email,
    password,
    passwordConfirm,
    nickname,
    errors: { ...errors, passwordConfirm: passwordConfirmError },
    previewUrl,
    imageError,
    isFormValid,
    isSubmitting,
    handleEmailChange: changeField('email', setEmail),
    handlePasswordChange,
    handlePasswordConfirmChange: changeField(
      'passwordConfirm',
      setPasswordConfirm,
    ),
    handleNicknameChange: changeField('nickname', setNickname),
    handleImageChange,
    handleSubmit,
  }
}
