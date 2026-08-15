import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from './useAuth'
import { useAsyncLock } from '../../../shared/hook/useAsyncLock'
import getLoginErrorMessage from '../utils/loginErrorMessage'
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
} from '../../../shared/utils/constants'

export const useLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const { run } = useAsyncLock()

  const clearLoginError = () => {
    if (loginError) {
      setLoginError('')
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    clearLoginError()
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    clearLoginError()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    setLoginError('')

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail) {
      setLoginError('이메일을 입력해주세요.')
      return
    }

    if (!trimmedPassword) {
      setLoginError('비밀번호를 입력해주세요.')
      return
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setLoginError('이메일 형식이 올바르지 않습니다.')
      return
    }

    if (!PASSWORD_PATTERN.test(password)) {
      setLoginError('비밀번호 형식이 올바르지 않습니다.')
      return
    }

    return run(async () => {
      try {
        await login({ email: trimmedEmail, password })
        navigate('/posts')
      } catch (error) {
        console.error('로그인 실패', error)
        setLoginError(getLoginErrorMessage(error))
      }
    })
  }

  return {
    email,
    password,
    loginError,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  }
}
