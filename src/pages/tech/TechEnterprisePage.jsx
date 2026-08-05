import TechEnterpriseSection from '../../features/tech/components/TechEnterpriseSection'
import { usePageTitle } from '../../shared/hook/usePageTitle'
import { TECH_ENTERPRISES } from '../../shared/utils/constants'

const TECH_ENTERPRISE_SECTIONS = [
  {
    id: 'enterprises',
    title: '테크 기업',
    description: '기업 개발 부서가 운영하는 블로그',
    enterprises: TECH_ENTERPRISES,
  },
]

function TechEnterprisePage() {
  usePageTitle('기술 원문')

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-24">
      <div className="mb-10">
        <p className="mb-6 text-center text-base leading-[1.6]">
          기업 <strong className="font-bold">개발</strong> 부서가 남긴 기술{' '}
          <strong className="font-bold">발자국</strong>을 따라
          <br />
          <strong className="font-bold">원문</strong>을 읽어보세요...🐾
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {TECH_ENTERPRISE_SECTIONS.map((section) => (
          <TechEnterpriseSection section={section} key={section.id} />
        ))}
      </div>
    </div>
  )
}

export default TechEnterprisePage
