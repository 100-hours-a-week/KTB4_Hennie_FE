import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useLogin } from '../../features/auth/hook/useLogin'

const { loginMock, navigateMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  navigateMock: vi.fn(),
}))

vi.mock(import('../../features/auth/hook/useAuth'), () => ({
  useAuth: () => ({ login: loginMock }),
}))

vi.mock(import('react-router'), async (importOriginal) => {
  const originalRouter = await importOriginal()

  return {
    ...originalRouter,
    useNavigate: () => navigateMock,
  }
})

const loginUser = {
  userId: 1,
  email: 'test@example.com',
  password: 'Test1234!',
}

describe('useLogin 테스트', () => {
  it('로그인에 성공했을 때 게시글 목록 페이지로 이동한다', async () => {
    // Arrange: 테스트 데이터 준비

    loginMock.mockResolvedValueOnce(loginUser)

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({
        target: { value: loginUser.email },
      })
      result.current.handlePasswordChange({
        target: { value: loginUser.password },
      })
    })

    const preventDefault = vi.fn() // 가짜 form submit 이벤트 함수

    // Act: 함수 실행
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert: 결과 검증
    expect(preventDefault).toHaveBeenCalled()
    expect(loginMock).toHaveBeenCalledWith({
      email: loginUser.email,
      password: loginUser.password,
    })
    expect(navigateMock).toHaveBeenCalledWith('/posts')
  })
})

describe('useLogin 실패', () => {
  it('이메일이 비어 있으면 로그인 API를 호출하지 않고 입력 오류 메시지를 설정한다', async () => {
    // Arrange
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({ target: { value: '' } })
      result.current.handlePasswordChange({
        target: { value: loginUser.password },
      })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert
    expect(loginMock).not.toHaveBeenCalled()
    expect(result.current.loginError).toBe('이메일을 입력해주세요.')
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('비밀번호가 비어 있으면 API를 호출하지 않고 입력 오류 메시지를 설정한다', async () => {
    // Arrange
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({ target: { value: loginUser.email } })
      result.current.handlePasswordChange({ target: { value: '' } })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })
    // Assert
    expect(loginMock).not.toHaveBeenCalled()
    expect(result.current.loginError).toBe('비밀번호를 입력해주세요.')
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it.each([
    ['@가 없는', 'testexample.com'],
    ['아이디가 없는', '@example.com'],
    ['도메인이 없는', 'test@.com'],
    ['도메인 구분점이 없는', 'test@example'],
    ['도메인 확장자가 없는', 'test@example.'],
    ['@가 두 개인', 'test@@example.com'],
    ['아이디에 공백이 포함된', 'test user@example.com'],
    ['도메인에 공백이 포함된', 'test@exam ple.com'],
    ['도메인 확장자에 공백이 포함된', 'test@example. com'],
  ])(
    '%s 이메일이면 API를 호출하지 않고 형식 오류 메시지를 설정한다',
    async (_, invalidEmail) => {
      // Arrange
      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.handleEmailChange({
          target: { value: invalidEmail },
        })
        result.current.handlePasswordChange({
          target: { value: loginUser.password },
        })
      })

      const preventDefault = vi.fn()

      // Act
      await act(async () => {
        await result.current.handleSubmit({ preventDefault })
      })

      // Assert
      expect(loginMock).not.toHaveBeenCalled()
      expect(result.current.loginError).toBe('이메일 형식이 올바르지 않습니다.')
      expect(navigateMock).not.toHaveBeenCalled()
    },
  )

  it.each([
    ['8자 미만인', 'Aa1!aaa'],
    ['20자를 초과한', `Aa1!${'a'.repeat(17)}`],
    ['소문자가 없는', 'AA123456!'],
    ['대문자가 없는', 'aa123456!'],
    ['숫자가 없는', 'Aaabcdef!'],
    ['특수문자가 없는', 'Aa123456'],
    ['공백이 포함된', 'Aa12 345!'],
  ])(
    '%s 비밀번호면 API를 호출하지 않고 형식 오류 메시지를 설정한다',
    async (_, invalidPassword) => {
      // Arrange
      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.handleEmailChange({
          target: { value: loginUser.email },
        })
        result.current.handlePasswordChange({
          target: { value: invalidPassword },
        })
      })

      const preventDefault = vi.fn()

      // Act
      await act(async () => {
        await result.current.handleSubmit({ preventDefault })
      })

      // Assert
      expect(loginMock).not.toHaveBeenCalled()
      expect(result.current.loginError).toBe(
        '비밀번호 형식이 올바르지 않습니다.',
      )
      expect(navigateMock).not.toHaveBeenCalled()
    },
  )

  it.each([
    ['가입되지 않은 이메일을', 'unknown@example.com', loginUser.password],
    ['잘못된 비밀번호를', loginUser.email, 'Wrong1234!'],
  ])('%s 입력하면 공통 오류 메시지를 설정한다', async (_, email, password) => {
    // Arrange
    loginMock.mockRejectedValueOnce({
      // 실제 로그인 API가 실패한 상황을 한 번만 흉내냄
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({
        target: { value: email },
      })
      result.current.handlePasswordChange({
        target: { value: password },
      })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert
    expect(loginMock).toHaveBeenCalledWith({ email, password })
    expect(result.current.loginError).toBe(
      '이메일 또는 비밀번호가 올바르지 않습니다.',
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('존재하지 않는 사용자의 요청에 대해 공통 오류 메시지를 설정한다', async () => {
    // Arrange
    loginMock.mockRejectedValueOnce({ status: 400 })

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({
        target: { value: loginUser.email },
      })
      result.current.handlePasswordChange({
        target: { value: loginUser.password },
      })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert
    expect(loginMock).toHaveBeenCalledWith({
      email: loginUser.email,
      password: loginUser.password,
    })
    expect(result.current.loginError).toBe(
      '이메일 또는 비밀번호가 올바르지 않습니다.',
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('서버 오류가 발생하면 서버 오류 메시지를 설정한다', async () => {
    // Arrange
    loginMock.mockRejectedValueOnce({ status: 500 })

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({
        target: { value: loginUser.email },
      })
      result.current.handlePasswordChange({
        target: { value: loginUser.password },
      })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert
    expect(loginMock).toHaveBeenCalledWith({
      email: loginUser.email,
      password: loginUser.password,
    })
    expect(result.current.loginError).toBe(
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })
  it('알 수 없는 오류가 발생하면 일반 실패 메시지를 설정한다', async () => {
    // Arrange
    loginMock.mockRejectedValueOnce(new Error('Network Error'))

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.handleEmailChange({
        target: { value: loginUser.email },
      })
      result.current.handlePasswordChange({
        target: { value: loginUser.password },
      })
    })

    const preventDefault = vi.fn()

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault })
    })

    // Assert
    expect(loginMock).toHaveBeenCalledWith({
      email: loginUser.email,
      password: loginUser.password,
    })
    expect(result.current.loginError).toBe(
      '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
