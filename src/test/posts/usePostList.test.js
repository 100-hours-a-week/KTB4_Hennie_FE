import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { usePostList } from '../../features/posts/hook/usePostList'
import { DEFAULT_PAGE_SIZE } from '../../shared/utils/constants'

const { getPostListMock } = vi.hoisted(() => ({
  getPostListMock: vi.fn(),
}))

vi.mock(import('../../features/posts/api/postApi'), () => ({
  getPostList: getPostListMock,
}))

const createPost = (id) => ({
  id,
  title: `게시글 ${id}`,
  category: 'FE',
  authorNickname: '테스터',
  authorProfileUrl: '/assets/profile-default.jpeg',
  createdAt: '2026-08-16T10:00:00',
  likeCount: 0,
  commentCount: 0,
  viewCount: 0,
})

const createPagination = (page, hasNext) => ({
  page,
  size: DEFAULT_PAGE_SIZE,
  totalCount: 3,
  totalPages: 3,
  hasNext,
})

const mockPageResponse = (page, hasNext) => {
  getPostListMock.mockResolvedValueOnce({
    posts: [createPost(page)],
    pagination: createPagination(page, hasNext),
  })
}

// 응답 시점을 테스트가 직접 정하기 위해 사람이 여는 프라미스를 넘긴다
const mockPendingResponse = () => {
  const pending = {}

  getPostListMock.mockImplementationOnce((_, options) => {
    pending.signal = options?.signal

    return new Promise((resolve, reject) => {
      pending.resolve = resolve
      pending.reject = reject
    })
  })

  return pending
}

const createAbortError = () => {
  const abortError = new Error('요청이 취소되었습니다.')
  abortError.name = 'AbortError'

  return abortError
}

// fetch 자체가 실패하면 status 없는 TypeError가 올라온다
const createNetworkError = () => new TypeError('Failed to fetch')

// 서버가 응답을 돌려주면 status를 가진 ApiError가 올라온다
const createApiError = (status) =>
  Object.assign(new Error(`API request failed: ${status}`), {
    name: 'ApiError',
    status,
  })

let consoleErrorSpy

beforeEach(() => {
  // 소비되지 않은 once 응답이 다음 테스트로 새지 않게 큐를 비운다
  getPostListMock.mockReset()

  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

const renderPostList = async () => {
  const view = renderHook(() => usePostList())

  await waitFor(() => {
    expect(view.result.current.isLoading).toBe(false)
  })

  return view
}

describe('usePostList 조회 성공', () => {
  it('첫 진입 시 1페이지를 기본 페이지 크기로 요청한다', async () => {
    // Arrange
    mockPageResponse(1, false)

    // Act
    renderHook(() => usePostList())

    // Assert
    await waitFor(() => {
      expect(getPostListMock).toHaveBeenCalledWith(
        {
          page: 1,
          size: DEFAULT_PAGE_SIZE,
        },
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
    })
  })

  it('조회에 성공하면 응답받은 게시글과 페이지 정보를 반환한다', async () => {
    // Arrange
    mockPageResponse(1, true)

    // Act
    const { result } = await renderPostList()

    // Assert
    expect(result.current.posts).toEqual([createPost(1)])
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.error).toBe('')
  })

  it('첫 응답이 오기 전에는 로딩 상태를 유지한다', async () => {
    // Arrange
    const pending = mockPendingResponse()

    // Act
    const { result } = renderHook(() => usePostList())

    // Assert: 요청이 나가기 전부터 로딩으로 보여준다
    expect(result.current.isLoading).toBe(true)
    expect(result.current.posts).toBeNull()

    await waitFor(() => {
      expect(pending.resolve).toBeDefined()
    })

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      pending.resolve({
        posts: [createPost(1)],
        pagination: createPagination(1, false),
      })
    })

    expect(result.current.isLoading).toBe(false)
  })
})

describe('usePostList 조회 실패', () => {
  it('네트워크가 끊기면 연결을 확인하라고 안내한다', async () => {
    // Arrange: status가 없는 오류는 서버에 닿지도 못했다는 뜻이다
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    // Act
    const { result } = await renderPostList()

    // Assert
    expect(result.current.error).toBe(
      '네트워크 연결을 확인한 뒤 다시 시도해주세요.',
    )
    expect(result.current.posts).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('로그인이 만료되면 다시 로그인하라고 안내한다', async () => {
    // Arrange: 목록은 비로그인도 볼 수 있어서 401은 토큰이 만료됐다는 뜻이다
    getPostListMock.mockRejectedValueOnce(createApiError(401))

    // Act
    const { result } = await renderPostList()

    // Assert
    expect(result.current.error).toBe(
      '로그인이 만료됐습니다. 다시 로그인해주세요.',
    )
  })

  it.each([[500], [502], [503]])(
    '서버가 %s로 응답하면 서버 오류 메시지를 설정한다',
    async (status) => {
      // Arrange
      getPostListMock.mockRejectedValueOnce(createApiError(status))

      // Act
      const { result } = await renderPostList()

      // Assert
      expect(result.current.error).toBe(
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      )
    },
  )

  it.each([[400], [404]])(
    '서버가 %s로 응답하면 일반 실패 메시지를 설정한다',
    async (status) => {
      // Arrange
      getPostListMock.mockRejectedValueOnce(createApiError(status))

      // Act
      const { result } = await renderPostList()

      // Assert
      expect(result.current.error).toBe('게시글 목록을 불러오지 못했습니다.')
    },
  )

  it('조회에 실패해도 로딩 상태를 해제한다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    // Act
    const { result } = await renderPostList()

    // Assert
    expect(result.current.isLoading).toBe(false)
  })

  it('조회에 실패해도 다음 페이지를 이어서 요청할 수 있다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createNetworkError())
    mockPageResponse(1, false)

    const { result } = await renderPostList()

    // Act: 실패한 페이지를 그대로 다시 요청한다
    await act(async () => {
      result.current.loadNextPage()
    })

    // Assert
    expect(getPostListMock).toHaveBeenCalledTimes(2)
    expect(result.current.error).toBe('')
    expect(result.current.posts).toEqual([createPost(1)])
  })

  it('요청이 취소되면 오류 메시지를 남기지 않는다', async () => {
    // Arrange
    const pending = mockPendingResponse()

    const { result, unmount } = renderHook(() => usePostList())

    await waitFor(() => {
      expect(getPostListMock).toHaveBeenCalled()
    })

    // Act: 응답이 오기 전에 화면을 떠난다
    unmount()

    await act(async () => {
      pending.reject(createAbortError())
    })

    // Assert
    expect(result.current.error).toBe('')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})

describe('usePostList 빈 목록', () => {
  it('게시글이 없으면 빈 배열을 반환한다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [],
      pagination: {
        page: 1,
        size: DEFAULT_PAGE_SIZE,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
      },
    })

    // Act
    const { result } = await renderPostList()

    // Assert: null(조회 전)과 구분돼야 빈 목록 안내를 띄울 수 있다
    expect(result.current.posts).toEqual([])
    expect(result.current.error).toBe('')
  })

  it('게시글이 없으면 다음 페이지가 없다고 알린다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [],
      pagination: {
        page: 1,
        size: DEFAULT_PAGE_SIZE,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
      },
    })

    // Act
    const { result } = await renderPostList()

    // Assert
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.currentPage).toBe(1)
  })
})

describe('usePostList 페이지네이션', () => {
  it('다음 페이지를 요청하면 현재 페이지 다음 번호로 요청한다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, false)

    const { result } = await renderPostList()

    // Act
    await act(async () => {
      result.current.loadNextPage()
    })

    // Assert
    expect(getPostListMock).toHaveBeenLastCalledWith(
      {
        page: 2,
        size: DEFAULT_PAGE_SIZE,
      },
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('페이지를 연달아 넘겨도 최신 페이지 번호로 요청한다', async () => {
    // Arrange: 페이지 번호가 최신값을 놓치면 같은 페이지를 반복 요청한다
    mockPageResponse(1, true)
    mockPageResponse(2, true)
    mockPageResponse(3, false)

    const { result } = await renderPostList()

    // Act
    await act(async () => {
      result.current.loadNextPage()
    })

    await act(async () => {
      result.current.loadNextPage()
    })

    // Assert
    expect(getPostListMock.mock.calls.map(([request]) => request.page)).toEqual(
      [1, 2, 3],
    )
    expect(result.current.currentPage).toBe(3)
  })

  it('이어 받은 게시글을 기존 목록 뒤에 덧붙인다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, false)

    const { result } = await renderPostList()

    // Act
    await act(async () => {
      result.current.loadNextPage()
    })

    // Assert
    expect(result.current.posts).toEqual([createPost(1), createPost(2)])
    expect(result.current.hasNextPage).toBe(false)
  })

  it('앞선 요청이 끝나기 전에 다시 요청하면 한 번만 호출한다', async () => {
    // Arrange
    mockPageResponse(1, true)

    const { result } = await renderPostList()

    const pending = mockPendingResponse()

    // Act: 스크롤이 빠르면 응답 전에 요청이 연달아 들어온다
    await act(async () => {
      result.current.loadNextPage()
      result.current.loadNextPage()
    })

    // Assert: 1페이지 1번 + 2페이지 1번
    expect(getPostListMock).toHaveBeenCalledTimes(2)

    await act(async () => {
      pending.resolve({
        posts: [createPost(2)],
        pagination: createPagination(2, false),
      })
    })

    expect(result.current.posts).toEqual([createPost(1), createPost(2)])
  })
})

describe('usePostList 생명주기', () => {
  it('언마운트되면 진행 중인 요청을 취소한다', async () => {
    // Arrange
    const pending = mockPendingResponse()

    const { unmount } = renderHook(() => usePostList())

    await waitFor(() => {
      expect(pending.signal).toBeDefined()
    })

    // Act
    unmount()

    // Assert
    expect(pending.signal.aborted).toBe(true)
  })

  it('언마운트 후 응답이 도착해도 목록을 갱신하지 않는다', async () => {
    // Arrange
    const pending = mockPendingResponse()

    const { result, unmount } = renderHook(() => usePostList())

    await waitFor(() => {
      expect(getPostListMock).toHaveBeenCalled()
    })

    // Act
    unmount()

    await act(async () => {
      pending.resolve({
        posts: [createPost(1)],
        pagination: createPagination(1, false),
      })
    })

    // Assert
    expect(result.current.posts).toBeNull()
  })
})
