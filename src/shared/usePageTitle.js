import { useEffect } from 'react'
import { APP_NAME } from './config'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title || APP_NAME
  }, [title])
}
