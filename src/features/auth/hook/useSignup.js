import { useEffect, useMemo, useState } from 'react'
import { signup } from '../api/authApi'
import getSignupErrorMessage from '../utils/signupErrorMessage'
import getSignupValidationErrors from '../utils/signupValidationErrors'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import { validateImageFile } from '../../../shared/utils/validateImageFile'
import { SIGNUP_EMPTY_ERRORS } from '../../../shared/utils/constants'

const hasSignupValidationErrors = (validationErrors) =>
  Object.values(validationErrors).some(Boolean)

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

  const trimmedEmail = email.trim()
  const trimmedNickname = nickname.trim()
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

  const createFieldChangeHandler = (field, setter) => (event) => {
    setter(event.target.value)
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleEmailChange = createFieldChangeHandler('email', setEmail)

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: '',
      passwordConfirm: '',
    }))
  }

  const handlePasswordConfirmChange = createFieldChangeHandler(
    'passwordConfirm',
    setPasswordConfirm,
  )

  const handleNicknameChange = createFieldChangeHandler('nickname', setNickname)

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

  const handleSignupFailure = (error) => {
    console.error('회원가입 실패', error)

    const serverFieldErrors = getServerFieldErrors(error)

    if (serverFieldErrors) {
      setErrors({ ...SIGNUP_EMPTY_ERRORS, ...serverFieldErrors })
      return
    }

    const signupError = getSignupErrorMessage(error)

    if (signupError.field) {
      setErrors({
        ...SIGNUP_EMPTY_ERRORS,
        [signupError.field]: signupError.message,
      })
      return
    }

    alert(signupError.message)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = getSignupValidationErrors({
      email: trimmedEmail,
      password,
      passwordConfirm,
      nickname: trimmedNickname,
    })

    setErrors(validationErrors)

    if (hasSignupValidationErrors(validationErrors) || imageError) {
      return
    }

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
        handleSignupFailure(error)
      }
    })
  }

  return {
    email,
    password,
    passwordConfirm,
    nickname,
    errors,
    previewUrl,
    imageError,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleNicknameChange,
    handleImageChange,
    handleSubmit,
  }
}
