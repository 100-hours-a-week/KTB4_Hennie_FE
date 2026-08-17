import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CommentForm from '../../features/posts/components/CommentForm'

const PLACEHOLDER = '댓글을 입력해주세요.'

const renderCommentForm = (props = {}) =>
  render(
    <CommentForm
      value=""
      placeholder={PLACEHOLDER}
      onChange={() => {}}
      onSubmit={() => {}}
      {...props}
    />,
  )

const getInput = () => screen.getByPlaceholderText(PLACEHOLDER)
// onCancel을 넘기지 않아 폼 안의 버튼은 등록 버튼 하나뿐이다
const getSubmitButton = () => screen.getByRole('button')

describe('댓글을 등록하는 중일 때', () => {
  it('입력과 등록 버튼을 모두 막는다', () => {
    // Arrange & Act
    renderCommentForm({ isPending: true })

    // Assert
    expect(getInput()).toBeDisabled()
    expect(getSubmitButton()).toBeDisabled()
  })

  it('등록 버튼 문구를 진행 중 문구로 바꾼다', () => {
    // Arrange & Act
    renderCommentForm({ isPending: true })

    // Assert
    expect(getSubmitButton()).toHaveTextContent('등록 중...')
  })
})

describe('아직 댓글을 쓸 수 없을 때', () => {
  it('입력과 등록 버튼을 모두 막는다', () => {
    // Arrange & Act
    renderCommentForm({ disabled: true })

    // Assert
    expect(getInput()).toBeDisabled()
    expect(getSubmitButton()).toBeDisabled()
  })

  it('등록 버튼 문구는 그대로 둔다', () => {
    // Arrange & Act
    renderCommentForm({ disabled: true })

    // Assert: 등록하고 있지 않은데 진행 중이라고 하면 안 된다
    expect(getSubmitButton()).toHaveTextContent('댓글 등록')
  })
})

describe('댓글을 쓸 수 있을 때', () => {
  it('입력과 등록 버튼을 열어둔다', () => {
    // Arrange & Act
    renderCommentForm()

    // Assert
    expect(getInput()).toBeEnabled()
    expect(getSubmitButton()).toBeEnabled()
    expect(getSubmitButton()).toHaveTextContent('댓글 등록')
  })
})
