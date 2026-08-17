import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CommentList from '../../features/posts/components/CommentList'
import { renderWithRouter } from '../renderWithRouter'

const firstComment = {
  id: 1,
  authorId: 10,
  authorNickname: '테스터',
  authorProfileUrl: '/assets/profile-default.webp',
  replyTo: null,
  content: '첫 번째 댓글',
  createdAt: '2026-08-16T10:00:00',
  edited: false,
  deleted: false,
  replies: [],
}

const EMPTY_MESSAGE = '아직 댓글이 없습니다.'

describe('댓글 목록 조회 전', () => {
  it('comments가 null이면 댓글이 없다고 단정하지 않는다', () => {
    // Arrange & Act
    renderWithRouter(<CommentList comments={null} />)

    // Assert: 아직 못 받은 것과 없는 것은 다르다
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument()
  })

  it('comments가 null이면 목록을 비운 채로 그린다', () => {
    // Arrange & Act
    renderWithRouter(<CommentList comments={null} />)

    // Assert
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})

describe('댓글 목록이 비었을 때', () => {
  it('빈 배열이면 아직 댓글이 없다고 안내한다', () => {
    // Arrange & Act
    renderWithRouter(<CommentList comments={[]} />)

    // Assert
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument()
  })
})

describe('댓글 목록에 항목이 있을 때', () => {
  it('빈 안내 없이 댓글만 표시한다', () => {
    // Arrange & Act
    renderWithRouter(<CommentList comments={[firstComment]} />)

    // Assert
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument()
    expect(screen.getByText(firstComment.content)).toBeInTheDocument()
  })
})
