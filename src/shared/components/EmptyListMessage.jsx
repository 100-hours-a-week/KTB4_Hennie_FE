import { withSubjectParticle } from '../utils/koreanParticle'

function EmptyListMessage({ label }) {
  return (
    <li className="py-6 text-center text-sm text-app-text-muted">
      {withSubjectParticle(label)} 존재하지 않습니다.
    </li>
  )
}

export default EmptyListMessage
