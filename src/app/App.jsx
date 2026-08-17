import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './layouts/AppLayout'
import GuestOnlyRoute from '../shared/routes/GuestOnlyRoute'
import ProtectedRoute from '../shared/routes/ProtectedRoute'
import NotFoundPage from '../shared/components/NotFoundPage'
// 목록과 상세는 진입 경로라 즉시 받는다. 청크로 나누면 왕복이 하나 늘어
// 상세 페이지 LCP가 0.8초 나빠지는 것을 측정으로 확인했다.
import PostListPage from '../pages/posts/PostListPage'
import PostDetailPage from '../pages/posts/PostDetailPage'

const PostWritePage = lazy(() => import('../pages/posts/PostWritePage'))
const PostEditPage = lazy(() => import('../pages/posts/PostEditPage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const SignupPage = lazy(() => import('../pages/auth/SignupPage'))
const MyPage = lazy(() => import('../pages/profile/MyPage'))
const NotificationPage = lazy(
  () => import('../pages/notification/NotificationPage'),
)
const TechEnterprisePage = lazy(
  () => import('../pages/tech/TechEnterprisePage'),
)
const TechArticleListPage = lazy(
  () => import('../pages/tech/TechArticleListPage'),
)

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/tech-enterprises" element={<TechEnterprisePage />} />
        <Route
          path="/tech-enterprises/:enterpriseSlug"
          element={<TechArticleListPage />}
        />
        <Route element={<GuestOnlyRoute />}>
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/write" element={<PostWritePage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
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
