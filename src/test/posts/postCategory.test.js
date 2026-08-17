import { describe, expect, it } from 'vitest'
import { getPostThumbnail } from '../../features/posts/utils/postCategory'

const DEFAULT_THUMBNAIL = '/assets/thumbnail/thumbnail_default.webp'

describe('카테고리가 있는 게시글의 썸네일', () => {
  it.each([
    ['FE', '/assets/thumbnail/thumbnail_fe.webp'],
    ['BE', '/assets/thumbnail/thumbnail_be.webp'],
    ['AI', '/assets/thumbnail/thumbnail_ai.webp'],
  ])('%s 게시글은 전용 썸네일을 사용한다', (category, expected) => {
    // Arrange & Act
    const thumbnail = getPostThumbnail(category)

    // Assert
    expect(thumbnail).toBe(expected)
  })
})

describe('카테고리를 알 수 없는 게시글의 썸네일', () => {
  it('등록되지 않은 카테고리면 기본 썸네일을 사용한다', () => {
    // Arrange & Act
    const thumbnail = getPostThumbnail('ETC')

    // Assert
    expect(thumbnail).toBe(DEFAULT_THUMBNAIL)
  })

  it('카테고리가 null이면 기본 썸네일을 사용한다', () => {
    // Arrange & Act: normalizePost가 카테고리 없는 응답을 null로 바꿔 넘긴다
    const thumbnail = getPostThumbnail(null)

    // Assert
    expect(thumbnail).toBe(DEFAULT_THUMBNAIL)
  })

  it('카테고리를 넘기지 않아도 기본 썸네일을 사용한다', () => {
    // Arrange & Act
    const thumbnail = getPostThumbnail()

    // Assert
    expect(thumbnail).toBe(DEFAULT_THUMBNAIL)
  })

  it('어떤 카테고리에도 이미지 주소를 비워두지 않는다', () => {
    // Arrange & Act: src가 undefined면 img가 깨진 칸으로 남는다
    const thumbnails = [
      getPostThumbnail('FE'),
      getPostThumbnail('ETC'),
      getPostThumbnail(null),
      getPostThumbnail(),
    ]

    // Assert
    thumbnails.forEach((thumbnail) => {
      expect(thumbnail).toEqual(expect.stringMatching(/^\/assets\/thumbnail\//))
    })
  })
})
