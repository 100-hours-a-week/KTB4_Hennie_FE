import { del, patch } from '../../../shared/api/http'
import { normalizeUser } from '../../auth/utils/normalizeUser'

export const updateMyInfo = async ({ nickname, profileUrl }) => {
  const response = await patch(
    '/users/myInfo',
    {
      nickname,
      ...(profileUrl ? { profileUrl } : {}),
    },
    { auth: true },
  )

  return normalizeUser(response?.data)
}

export const updatePassword = ({ currentPassword, newPassword }) =>
  patch('/users/password', { currentPassword, newPassword }, { auth: true })

export const withdrawMyInfo = () =>
  del('/users/myInfo', {
    auth: true,
  })
