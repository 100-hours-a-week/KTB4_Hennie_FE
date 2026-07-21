import { useNavigate } from 'react-router'

export const useProfileComplete = ({ hasChanges, saveNickname }) => {
  const navigate = useNavigate()

  const completeProfile = async () => {
    if (hasChanges()) {
      if (!(await saveNickname())) {
        return
      }
      alert('회원정보가 수정되었습니다.')
    }

    navigate('/posts')
  }

  return { completeProfile }
}
