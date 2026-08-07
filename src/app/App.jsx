import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import GuestOnlyRoute from '../shared/routes/GuestOnlyRoute'
import ProtectedRoute from '../shared/routes/ProtectedRoute'
import NotFoundPage from '../shared/components/NotFoundPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import MyPage from '../pages/profile/MyPage'
import PostListPage from '../pages/posts/PostListPage'
import PostWritePage from '../pages/posts/PostWritePage'
import PostDetailPage from '../pages/posts/PostDetailPage'
import PostEditPage from '../pages/posts/PostEditPage'
import TechEnterprisePage from '../pages/tech/TechEnterprisePage'
import TechArticleListPage from '../pages/tech/TechArticleListPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/tech-enterprises" element={<TechEnterprisePage />} />
        <Route
          path="/tech-enterprises/:enterprise"
          element={<TechArticleListPage />}
        />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/write" element={<PostWritePage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/users/myInfo" element={<MyPage />} />
          <Route
            path="/users/myInfo/password"
            element={<Navigate to="/users/myInfo#password" replace />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
