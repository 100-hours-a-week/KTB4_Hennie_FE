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
  authorProfileUrl: '/assets/profile-default.jpeg',
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
  authorProfileUrl: '/assets/profile-default.jpeg',
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

beforeEach(() => {
  // jsdom에는 IntersectionObserver가 없어서 무한 스크롤 감지를 대체한다
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
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
