import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSignup } from '../../features/auth/hook/useSignup'

const { signupMock } = vi.hoisted(() => ({
  signupMock: vi.fn(),
}))

vi.mock(import('../../features/auth/api/authApi'), () => ({
  signup: signupMock,
}))

const signupUser = {
  userId: 1,
  email: 'test@example.com',
  password: 'Test1234!',
  nickname: '테스터',
}

const alertMock = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('alert', alertMock)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('클라이언트 입력 검증', () => {
  it('허용하지 않은 이미지 형식이면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))
    const invalidImage = new File(['profile'], 'profile.webp', {
      type: 'image/webp',
    })
    const imageInput = {
      files: [invalidImage],
      value: 'profile.webp',
    }

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
      result.current.handleImageChange({ target: imageInput })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.imageError).toBe(
      'JPEG, PNG 형식의 이미지만 업로드할 수 있습니다.',
    )
    expect(imageInput.value).toBe('')
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('이메일 형식이 올바르지 않으면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({
        target: { value: 'invalid@email' },
      })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.errors.email).toBe('이메일 형식이 올바르지 않습니다.')
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('비밀번호 형식이 올바르지 않으면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: 'invalid password' },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: 'invalid password' },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.errors.password).toBe(
      '비밀번호 형식이 올바르지 않습니다.',
    )
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('비밀번호 확인이 일치하지 않으면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: 'Different1234!' },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.errors.passwordConfirm).toBe(
      '비밀번호가 일치하지 않습니다.',
    )
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('닉네임이 10자를 초과하면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: '12345678901' },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.errors.nickname).toBe(
      '닉네임은 10자 이하로 입력해주세요.',
    )
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('닉네임에 공백이 있으면 오류 메시지를 설정하고 API를 호출하지 않는다', async () => {
    const navigateMock = vi.fn()
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: '테스트 닉네임' },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(result.current.errors.nickname).toBe(
      '닉네임에는 공백을 사용할 수 없습니다.',
    )
    expect(signupMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})

describe('회원가입 API 실패 처리', () => {
  it('중복 이메일 응답이면 이메일 오류 메시지를 설정한다', async () => {
    const navigateMock = vi.fn()
    signupMock.mockRejectedValueOnce({
      status: 409,
      code: 'EMAIL_ALREADY_EXISTS',
    })
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(signupMock).toHaveBeenCalledTimes(1)
    expect(signupMock).toHaveBeenCalledWith({
      email: signupUser.email,
      password: signupUser.password,
      nickname: signupUser.nickname,
      profileImage: null,
    })
    expect(result.current.errors.email).toBe('이미 사용중인 이메일입니다.')
    expect(alertMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('중복 닉네임 응답이면 닉네임 오류 메시지를 설정한다', async () => {
    const navigateMock = vi.fn()
    signupMock.mockRejectedValueOnce({
      status: 409,
      code: 'NICKNAME_ALREADY_EXISTS',
    })
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(signupMock).toHaveBeenCalledTimes(1)
    expect(signupMock).toHaveBeenCalledWith({
      email: signupUser.email,
      password: signupUser.password,
      nickname: signupUser.nickname,
      profileImage: null,
    })
    expect(result.current.errors.nickname).toBe('이미 사용중인 닉네임입니다.')
    expect(alertMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('내부 서버 오류가 발생하면 일반 실패 메시지를 표시한다', async () => {
    const navigateMock = vi.fn()
    signupMock.mockRejectedValueOnce({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    })
    const { result } = renderHook(() => useSignup({ navigate: navigateMock }))

    act(() => {
      result.current.handleEmailChange({ target: { value: signupUser.email } })
      result.current.handlePasswordChange({
        target: { value: signupUser.password },
      })
      result.current.handlePasswordConfirmChange({
        target: { value: signupUser.password },
      })
      result.current.handleNicknameChange({
        target: { value: signupUser.nickname },
      })
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() })
    })

    expect(signupMock).toHaveBeenCalledTimes(1)
    expect(signupMock).toHaveBeenCalledWith({
      email: signupUser.email,
      password: signupUser.password,
      nickname: signupUser.nickname,
      profileImage: null,
    })
    expect(alertMock).toHaveBeenCalledWith('회원가입에 실패했습니다.')
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
