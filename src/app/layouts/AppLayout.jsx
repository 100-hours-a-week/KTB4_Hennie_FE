import { Outlet } from 'react-router'
import Header from '../../shared/components/Header'

function AppLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
