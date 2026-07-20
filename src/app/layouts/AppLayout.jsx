import { Outlet } from 'react-router'
import Header from '../../shared/components/Header'

function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
