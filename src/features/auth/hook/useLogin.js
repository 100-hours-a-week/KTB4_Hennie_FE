import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from './useAuth'

// 로그인 실패 메시지 매핑 (useLogin 전용)
const getLoginErrorMessage = (error) => {
  if (error?.status === 400) {
    return '이메일과 비밀번호를 다시 확인해주세요.'
  }

  if (error?.status === 401 || error?.code === 'INVALID_CREDENTIALS') {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }

  if (error?.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }

  return '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
}

export const useLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  // 중복 제출 방지용(UI 상태 아님, 리렌더 없음)
  const isSubmittingRef = useRef(false)

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmittingRef.current) {
      return
    }

    isSubmittingRef.current = true
    setLoginError('')

    try {
      await login({ email: email.trim(), password })
      navigate('/posts')
    } catch (error) {
      console.error('로그인 실패', error)
      setLoginError(getLoginErrorMessage(error))
    } finally {
      isSubmittingRef.current = false
    }
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
