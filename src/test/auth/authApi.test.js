import { afterEach, describe, expect, it, vi } from 'vitest'
import { login } from '../../features/auth/api/authApi'
import { clearAccessToken, getAccessToken } from '../../shared/api/tokenManager'

describe('로그인 시 토큰 저장 시나리오', () => {
  afterEach(() => {
    clearAccessToken()
    vi.unstubAllGlobals()
  })

  it('로그인 성공 응답에 액세스 토큰이 없으면 로그인에 실패한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            user: {
              id: 1,
              email: 'test@example.com',
              nickname: '테스터',
              profileUrl: null,
            },
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const loginPromise = login({
      email: 'test@example.com',
      password: 'Test1234!',
    })

    await expect(loginPromise).rejects.toThrow()
    expect(getAccessToken()).toBeNull()
  })
})
