import { withSubjectParticle } from '../utils/koreanParticle'

function EmptyListMessage({ label }) {
  return (
    <li className="app-empty">
      {withSubjectParticle(label)} 존재하지 않습니다.
    </li>
  )
}

export default EmptyListMessage
