import { useEffect } from 'react'

const APP_NAME = '개발바닥'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title || APP_NAME
  }, [title])
}
