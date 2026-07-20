import { Route, Routes } from 'react-router'
import AppLayout from './AppLayout'
import NotFoundPage from './NotFoundPage'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import SignupPage from '../features/auth/SignupPage'
import ProfileEditPage from '../features/auth/ProfileEditPage'
import PasswordEditPage from '../features/auth/PasswordEditPage'
import PostListPage from '../features/posts/PostListPage'
import PostWritePage from '../features/posts/PostWritePage'
import PostDetailPage from '../features/posts/PostDetailPage'
import PostEditPage from '../features/posts/PostEditPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/write" element={<PostWritePage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/users/myInfo" element={<ProfileEditPage />} />
          <Route path="/users/myInfo/password" element={<PasswordEditPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
