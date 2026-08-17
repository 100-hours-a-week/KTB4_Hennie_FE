import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PostDetailPage from '../../pages/posts/PostDetailPage'
import AuthContext from '../../features/auth/hook/context'
import { renderWithRouter } from '../renderWithRouter'

const { getPostMock } = vi.hoisted(() => ({
  getPostMock: vi.fn(),
}))

vi.mock(import('../../features/posts/api/postApi'), () => ({
  getPost: getPostMock,
  deletePost: vi.fn(),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
  reportPost: vi.fn(),
}))

vi.mock(import('../../features/posts/api/commentApi'), () => ({
  createComment: vi.fn(),
  deleteComment: vi.fn(),
  updateComment: vi.fn(),
  createReply: vi.fn(),
  updateReply: vi.fn(),
  deleteReply: vi.fn(),
}))

const post = {
  id: 1,
  title: '첫 번째 게시글',
  authorNickname: '테스터',
  authorProfileUrl: '/assets/profile-default.webp',
  content: '본문 내용입니다.',
  category: 'FE',
  createdAt: '2026-08-16T10:00:00',
  modifiedAt: '',
  edited: false,
  likeCount: 3,
  liked: false,
  commentCount: 0,
  viewCount: 10,
  blinded: false,
  reportCount: 0,
  status: '',
  comments: [],
}

const COMMENT_PLACEHOLDER = '이 기술에 대한 생각을 개발자국으로 남겨보세요'
const NOT_FOUND_TITLE = '게시글을 찾을 수 없습니다'
const NO_COMMENT_MESSAGE = '아직 댓글이 없습니다.'

const renderDetailPage = () =>
  renderWithRouter(
    <AuthContext.Provider value={{ currentUser: null }}>
      <Routes>
        <Route path="/posts/:postId" element={<PostDetailPage />} />
      </Routes>
    </AuthContext.Provider>,
    { initialEntries: ['/posts/1'] },
  )

// 응답을 붙잡아 두고 조회 중 화면을 관찰한다
const holdPostResponse = () => {
  let resolvePost

  getPostMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolvePost = resolve
      }),
  )

  return () => resolvePost(post)
}

const getCommentInput = () => screen.getByPlaceholderText(COMMENT_PLACEHOLDER)

beforeEach(() => {
  getPostMock.mockReset()

  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('게시글 상세 페이지 조회 중', () => {
  it('아직 게시글이 없어도 찾을 수 없다고 알리지 않는다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()

    // Assert: post가 null인 것과 조회에 실패한 것을 구분해야 한다
    await waitFor(() => {
      expect(getPostMock).toHaveBeenCalled()
    })
    expect(screen.queryByText(NOT_FOUND_TITLE)).not.toBeInTheDocument()

    releasePost()
    await screen.findByText(post.title)
  })

  it('게시글을 기다리는 동안에도 댓글 입력창을 보여준다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()

    // Assert: 댓글 입력창은 게시글 데이터가 없어도 그릴 수 있다
    expect(
      await screen.findByPlaceholderText(COMMENT_PLACEHOLDER),
    ).toBeVisible()

    releasePost()
    await screen.findByText(post.title)
  })

  it('게시글을 기다리는 동안에는 댓글을 입력하지 못하게 막는다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()

    // Assert: 어느 게시글인지 정해지기 전에 작성이 시작되면 안 된다
    expect(
      await screen.findByPlaceholderText(COMMENT_PLACEHOLDER),
    ).toBeDisabled()

    releasePost()
    await screen.findByText(post.title)
  })

  it('게시글을 기다리는 동안 등록 버튼 문구를 바꾸지 않는다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()
    await screen.findByPlaceholderText(COMMENT_PLACEHOLDER)

    // Assert: 등록하고 있지 않은데 진행 중이라고 하면 안 된다
    expect(screen.getByRole('button', { name: '댓글 등록' })).toBeDisabled()

    releasePost()
    await screen.findByText(post.title)
  })

  it('게시글을 기다리는 동안 댓글이 없다고 단정하지 않는다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()
    await screen.findByPlaceholderText(COMMENT_PLACEHOLDER)

    // Assert: 댓글은 게시글 응답에 함께 오므로 아직 알 수 없다
    expect(screen.queryByText(NO_COMMENT_MESSAGE)).not.toBeInTheDocument()

    releasePost()
    await screen.findByText(post.title)
  })

  it('조회 중임을 화면 낭독기에 알린다', async () => {
    // Arrange
    const releasePost = holdPostResponse()

    // Act
    renderDetailPage()

    // Assert
    expect(await screen.findByRole('status')).toHaveTextContent(
      '게시글을 불러오는 중입니다',
    )

    releasePost()
    await screen.findByText(post.title)
  })
})

describe('게시글 상세 페이지 조회 성공', () => {
  it('제목과 본문을 표시한다', async () => {
    // Arrange
    getPostMock.mockResolvedValueOnce(post)

    // Act
    renderDetailPage()

    // Assert
    expect(
      await screen.findByRole('heading', { name: post.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(post.content)).toBeInTheDocument()
  })

  it('조회가 끝나면 댓글을 입력할 수 있다', async () => {
    // Arrange
    getPostMock.mockResolvedValueOnce(post)

    // Act
    renderDetailPage()
    await screen.findByText(post.title)

    // Assert
    expect(getCommentInput()).toBeEnabled()
  })
})

describe('게시글 상세 페이지 조회 실패', () => {
  it('없는 게시글이면 찾을 수 없다고 알린다', async () => {
    // Arrange
    getPostMock.mockResolvedValueOnce(null)

    // Act
    renderDetailPage()

    // Assert
    expect(await screen.findByText(NOT_FOUND_TITLE)).toBeInTheDocument()
  })

  it('조회에 실패하면 댓글 입력창을 남겨두지 않는다', async () => {
    // Arrange
    getPostMock.mockResolvedValueOnce(null)

    // Act
    renderDetailPage()
    await screen.findByText(NOT_FOUND_TITLE)

    // Assert: 쓸 수 없는 댓글창이 남아 오해를 주면 안 된다
    expect(
      screen.queryByPlaceholderText(COMMENT_PLACEHOLDER),
    ).not.toBeInTheDocument()
  })
})
