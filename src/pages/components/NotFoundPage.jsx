import { usePageTitle } from '../../shared/hook/usePageTitle'

function NotFoundPage() {
  usePageTitle('페이지를 찾을 수 없습니다')

  return (
    <>
      <section className="mx-auto max-w-[720px] px-6 pt-8 pb-24">
        <h1>페이지를 찾을 수 없습니다</h1>
      </section>
    </>
  )
}

export default NotFoundPage
