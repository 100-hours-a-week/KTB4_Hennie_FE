import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PostList from '../../features/posts/components/PostList'
import { renderWithRouter } from '../renderWithRouter'

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

const EMPTY_MESSAGE = '게시글이 존재하지 않습니다.'

const getList = () => screen.getByRole('list', { name: '게시글 목록' })

describe('게시글 목록 조회 전', () => {
  it('posts가 null이면 빈 안내를 표시하지 않는다', () => {
    // Arrange & Ac
    renderWithRouter(<PostList posts={null} />)

    // Assert: 조회 중에 '존재하지 않습니다'가 깜빡이면 안 된다
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument()
  })

  it('posts가 null이면 목록을 비운 채로 그린다', () => {
    // Arrange & Act
    renderWithRouter(<PostList posts={null} />)

    // Assert: 목록 자체는 있고 항목만 없다
    expect(getList()).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})

describe('게시글 목록이 비었을 때', () => {
  it('빈 배열이면 빈 안내를 표시한다', () => {
    // Arrange & Act
    renderWithRouter(<PostList posts={[]} />)

    // Assert
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument()
  })

  it('빈 안내를 목록 항목으로 표시한다', () => {
    // Arrange & Act
    renderWithRouter(<PostList posts={[]} />)

    // Assert: ul의 자식은 li여야 해서 안내도 항목으로 들어간다
    const emptyItem = within(getList()).getByRole('listitem')

    expect(emptyItem).toHaveTextContent(EMPTY_MESSAGE)
  })
})

describe('게시글 목록에 항목이 있을 때', () => {
  it('빈 안내 없이 게시글만 표시한다', () => {
    // Arrange & Act
    renderWithRouter(<PostList posts={[firstPost]} />)

    // Assert
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument()
    expect(screen.getByText(firstPost.title)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
