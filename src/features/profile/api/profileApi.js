import { del, patch } from '../../../shared/api/http'
import { normalizeUser } from '../../auth/utils/normalizeUser'

export const updateMyInfo = async ({ nickname, profileImage }) => {
  const formData = new FormData()

  formData.append(
    'request',
    new Blob([JSON.stringify({ nickname })], {
      type: 'application/json',
    }),
  )

  if (profileImage) {
    formData.append('profileImage', profileImage)
  }

  const response = await patch('/users/myInfo', formData, { auth: true })

  return normalizeUser(response?.data)
}

export const updatePassword = ({ currentPassword, newPassword }) =>
  patch('/users/password', { currentPassword, newPassword }, { auth: true })

export const withdrawMyInfo = () =>
  del('/users/myInfo', {
    auth: true,
  })
