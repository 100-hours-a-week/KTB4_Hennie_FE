import { act, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PostListPage from '../../pages/posts/PostListPage'
import { DEFAULT_PAGE_SIZE } from '../../shared/utils/constants'
import { renderWithRouter } from '../renderWithRouter'

const { getPostListMock } = vi.hoisted(() => ({
  getPostListMock: vi.fn(),
}))

vi.mock(import('../../features/posts/api/postApi'), () => ({
  getPostList: getPostListMock,
}))

// getPostList가 normalizePostList를 거쳐 반환하는 모양
const firstPost = {
  id: 1,
  title: '첫 번째 게시글',
  category: 'FE',
  authorNickname: '테스터',
  authorProfileUrl: '/assets/profile-default.webp',
  createdAt: '2026-08-16T10:00:00',
  likeCount: 3,
  commentCount: 2,
  viewCount: 10,
}

const secondPost = {
  id: 2,
  title: '두 번째 게시글',
  category: 'BE',
  authorNickname: '다른작성자',
  authorProfileUrl: '/assets/profile-default.webp',
  createdAt: '2026-08-15T09:30:00',
  likeCount: 0,
  commentCount: 0,
  viewCount: 1,
}

const lastPagePagination = {
  page: 1,
  size: DEFAULT_PAGE_SIZE,
  totalCount: 2,
  totalPages: 1,
  hasNext: false,
}

const createPost = (id) => ({
  ...firstPost,
  id,
  title: `게시글 ${id}`,
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

let observers = []

beforeEach(() => {
  observers = []

  // 소비되지 않은 once 응답이 다음 테스트로 새지 않게 큐를 비운다
  getPostListMock.mockReset()

  // 훅이 실패를 콘솔에 남겨서 테스트 출력에 섞이지 않게 막는다
  vi.spyOn(console, 'error').mockImplementation(() => {})

  // jsdom에는 IntersectionObserver가 없어서 무한 스크롤 감지를 대체한다
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(onIntersect) {
        this.onIntersect = onIntersect
        this.isObserving = false
        observers.push(this)
      }

      observe() {
        this.isObserving = true
      }

      disconnect() {
        this.isObserving = false
      }
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// 조회가 끝나고 DOM 접근용 ref 관찰이 시작될 때까지 기다린다
const waitForSentinelObserver = async () => {
  let observer

  await waitFor(() => {
    observer = observers.findLast((candidate) => candidate.isObserving)
    expect(observer).toBeDefined()
  })

  return observer
}

// DOM 접근용 ref이 화면에 들어온 상황을 흉내낸다
const scrollToSentinel = async () => {
  const observer = await waitForSentinelObserver()

  await act(async () => {
    observer.onIntersect([{ isIntersecting: true }])
  })
}

const isObservingSentinel = () =>
  observers.some((observer) => observer.isObserving)

const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인한 뒤 다시 시도해주세요.'
const SERVER_ERROR_MESSAGE =
  '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'

// fetch 자체가 실패하면 status 없는 TypeError가 올라온다
const createNetworkError = () => new TypeError('Failed to fetch')

const createApiError = (status) =>
  Object.assign(new Error(`API request failed: ${status}`), {
    name: 'ApiError',
    status,
  })

describe('게시글 목록 페이지 조회 성공', () => {
  it('첫 진입 시 1페이지를 기본 페이지 크기로 요청한다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [firstPost, secondPost],
      pagination: lastPagePagination,
    })

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

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

  it('조회하는 동안 로딩 문구를 표시한다', async () => {
    // Arrange: 응답이 오지 않는 요청 준비
    let resolveGetPostList
    getPostListMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveGetPostList = resolve
        }),
    )

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    expect(
      await screen.findByText('게시글을 불러오는 중입니다...'),
    ).toBeInTheDocument()

    await act(async () => {
      resolveGetPostList({
        posts: [firstPost],
        pagination: lastPagePagination,
      })
    })
  })

  it('조회에 성공하면 응답받은 게시글을 목록에 표시한다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [firstPost, secondPost],
      pagination: lastPagePagination,
    })

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    expect(await screen.findByText(firstPost.title)).toBeInTheDocument()
    expect(screen.getByText(secondPost.title)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('조회에 성공하면 각 게시글에 상세 페이지 링크를 건다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [firstPost, secondPost],
      pagination: lastPagePagination,
    })

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    const firstPostLink = await screen.findByRole('link', {
      name: new RegExp(firstPost.title),
    })

    expect(firstPostLink).toHaveAttribute('href', `/posts/${firstPost.id}`)
  })

  it('조회가 끝나면 로딩 문구를 지운다', async () => {
    // Arrange
    getPostListMock.mockResolvedValueOnce({
      posts: [firstPost],
      pagination: lastPagePagination,
    })

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    await screen.findByText(firstPost.title)

    expect(
      screen.queryByText('게시글을 불러오는 중입니다...'),
    ).not.toBeInTheDocument()
  })
})

describe('게시글 목록 페이지 무한 스크롤', () => {
  it('DOM 접근용 ref이 보이면 다음 페이지를 이어서 요청한다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, false)

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    // Act
    await scrollToSentinel()

    // Assert
    await waitFor(() => {
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
  })

  it('이어 받은 게시글을 기존 목록 뒤에 덧붙인다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, false)

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    // Act
    await scrollToSentinel()

    // Assert
    expect(await screen.findByText('게시글 2')).toBeInTheDocument()
    expect(screen.getByText('게시글 1')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('페이지를 넘길 때마다 다음 페이지 번호를 요청한다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, true)
    mockPageResponse(3, false)

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    // Act
    await scrollToSentinel()
    await screen.findByText('게시글 2')

    await scrollToSentinel()
    await screen.findByText('게시글 3')

    // Assert
    expect(getPostListMock.mock.calls.map(([request]) => request.page)).toEqual(
      [1, 2, 3],
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('DOM 접근용 ref이 연달아 감지돼도 다음 페이지를 한 번만 요청한다', async () => {
    // Arrange
    mockPageResponse(1, true)
    mockPageResponse(2, true)

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    const observer = await waitForSentinelObserver()

    // Act: 스크롤이 빠르면 리렌더 전에 감지가 연달아 들어온다
    await act(async () => {
      observer.onIntersect([{ isIntersecting: true }])
      observer.onIntersect([{ isIntersecting: true }])
    })

    // Assert: 1페이지 1번 + 2페이지 1번
    expect(getPostListMock).toHaveBeenCalledTimes(2)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('마지막 페이지를 받으면 DOM 접근용 ref을 더 이상 관찰하지 않는다', async () => {
    // Arrange
    mockPageResponse(1, false)

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Act
    await screen.findByText('게시글 1')

    // Assert: 관찰이 시작되지 않아 스크롤해도 요청할 수 없다
    expect(isObservingSentinel()).toBe(false)
    expect(getPostListMock).toHaveBeenCalledTimes(1)
  })
})

describe('게시글 목록 페이지 조회 실패', () => {
  it('네트워크가 끊기면 연결을 확인하라고 안내한다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    expect(await screen.findByText(NETWORK_ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('서버 오류가 발생하면 서버 오류 메시지를 표시한다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createApiError(500))

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert
    expect(await screen.findByText(SERVER_ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('오류 문구를 화면 낭독기가 읽어주는 상태 영역에 표시한다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert: 로딩·마지막 페이지 안내와 같은 자리에 한 번만 담긴다
    const statusRegion = await screen.findByText(NETWORK_ERROR_MESSAGE)

    expect(statusRegion).toHaveAttribute('aria-live', 'polite')
    expect(screen.getAllByText(NETWORK_ERROR_MESSAGE)).toHaveLength(1)
  })

  it('조회에 실패하면 로딩 문구를 오류 문구로 바꾼다', async () => {
    // Arrange
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    // Act
    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    // Assert: 상태 영역은 한 문구만 보여줘서 로딩이 남아 있으면 안 된다
    await screen.findByText(NETWORK_ERROR_MESSAGE)

    expect(
      screen.queryByText('게시글을 불러오는 중입니다...'),
    ).not.toBeInTheDocument()
  })

  it('이어 받다 실패해도 이미 표시한 게시글은 남긴다', async () => {
    // Arrange
    mockPageResponse(1, true)
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    // Act
    await scrollToSentinel()

    // Assert
    await screen.findByText(NETWORK_ERROR_MESSAGE)

    expect(screen.getByText('게시글 1')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('이어 받다 실패하면 더 이상 다음 페이지를 요청하지 않는다', async () => {
    // Arrange
    mockPageResponse(1, true)
    getPostListMock.mockRejectedValueOnce(createNetworkError())

    renderWithRouter(<PostListPage />, {
      initialEntries: ['/posts'],
    })

    await screen.findByText('게시글 1')

    // Act
    await scrollToSentinel()
    await screen.findByText(NETWORK_ERROR_MESSAGE)

    // Assert: 관찰을 끊어 실패한 요청을 스크롤할 때마다 되풀이하지 않는다
    expect(isObservingSentinel()).toBe(false)
    expect(getPostListMock).toHaveBeenCalledTimes(2)
  })
})
