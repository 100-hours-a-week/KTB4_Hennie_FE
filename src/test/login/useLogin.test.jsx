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

describe('useLogin 테스트', () => {
  it('로그인에 성공했을 때 게시글 목록 페이지로 이동한다', async () => {
    // Arrange: 테스트 데이터 준비
    const loginUser = {
      userId: 1,
      email: 'test@example.com',
      password: 'Test1234!',
    }

    loginMock.mockResolvedValueOnce(loginUser)

    const {result} = renderHook(()=>useLogin())

    act(()=> {
        result.current.handleEmailChange({
            target: {value: loginUser.email}
        })
        result.current.handlePasswordChange({
            target: {value: loginUser.password}
        })
    })

    const preventDefault = vi.fn() // 가짜 form submit 이벤트 함수

    // Act: 함수 실행
    await act(async () => {
        await result.current.handleSubmit({preventDefault})
    })

    // Assert: 결과 검증
    expect(preventDefault).toHaveBeenCalled()
    expect(loginMock).toHaveBeenCalledWith({
        email: loginUser.email,
        password: loginUser.password,
    })
    expect(navigateMock).toHaveBeenCalledWith('/posts')
  })

  it.todo('로그인에 실패했을 때', () => {
    expect
  })
})
