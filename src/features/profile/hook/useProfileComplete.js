import { useNavigate } from 'react-router'

export const useProfileComplete = ({
  hasChanges,
  saveProfile,
  hasImageError,
}) => {
  const navigate = useNavigate()

  const completeProfile = async () => {
    if (hasImageError) {
      return
    }

    if (hasChanges()) {
      if (!(await saveProfile())) {
        return
      }
      alert('회원정보가 수정되었습니다.')
    }

    navigate('/posts')
  }

  return { completeProfile }
}
