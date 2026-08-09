import { useContext } from 'react'
import NotificationContext from './context'

export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'useNotification은 NotificationProvider 안에서만 사용할 수 있습니다.',
    )
  }

  return context
}
