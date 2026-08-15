import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SignupPage from '../../pages/auth/SignupPage'
import { renderWithRouter } from '../renderWithRouter'

const { signupMock } = vi.hoisted(() => ({
  signupMock: vi.fn(),
}))

vi.mock(import('../../features/auth/api/authApi'), () => ({
  signup: signupMock,
}))

beforeEach(() => {
  vi.stubGlobal('alert', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('회원가입 컴포넌트 내 제출 버튼', () => {
  it('회원가입 요청 중에는 버튼을 비활성화하고 가입 중 문구를 표시한다', async () => {
    // Arrange
    let resolveSignup
    signupMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve
        }),
    )
    const user = userEvent.setup()

    renderWithRouter(<SignupPage />, {
      initialEntries: ['/users/signup'],
    })

    await user.type(
      screen.getByLabelText('이메일', { selector: 'input' }),
      'test@example.com',
    )
    await user.type(
      screen.getByLabelText('비밀번호', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('비밀번호 확인', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('닉네임', { selector: 'input' }),
      '테스터',
    )

    const submitButton = screen.getByRole('button', {
      name: '회원가입',
    })

    // Act
    await user.click(submitButton)

    // Assert
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('가입 중...')

    await act(async () => {
      resolveSignup()
    })
  })

  it('회원가입 요청 중에 버튼을 다시 클릭해도 API를 한 번만 호출한다', async () => {
    // Arrange
    let resolveSignup
    signupMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve
        }),
    )
    const user = userEvent.setup()

    renderWithRouter(<SignupPage />, {
      initialEntries: ['/users/signup'],
    })

    await user.type(
      screen.getByLabelText('이메일', { selector: 'input' }),
      'test@example.com',
    )
    await user.type(
      screen.getByLabelText('비밀번호', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('비밀번호 확인', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('닉네임', { selector: 'input' }),
      '테스터',
    )

    const submitButton = screen.getByRole('button', {
      name: '회원가입',
    })

    await user.click(submitButton)

    // Act
    await user.click(submitButton)

    // Assert
    expect(signupMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveSignup()
    })
  })

  it('회원가입 요청이 완료되면 버튼을 다시 활성화한다', async () => {
    // Arrange
    let resolveSignup
    signupMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignup = resolve
        }),
    )
    const user = userEvent.setup()

    renderWithRouter(<SignupPage />, {
      initialEntries: ['/users/signup'],
    })

    await user.type(
      screen.getByLabelText('이메일', { selector: 'input' }),
      'test@example.com',
    )
    await user.type(
      screen.getByLabelText('비밀번호', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('비밀번호 확인', { selector: 'input' }),
      'Test1234!',
    )
    await user.type(
      screen.getByLabelText('닉네임', { selector: 'input' }),
      '테스터',
    )

    const submitButton = screen.getByRole('button', {
      name: '회원가입',
    })

    await user.click(submitButton)

    // Act
    await act(async () => {
      resolveSignup()
    })

    // Assert
    await waitFor(() => {
      expect(submitButton).toBeEnabled()
      expect(submitButton).toHaveTextContent('회원가입')
    })
  })
})
