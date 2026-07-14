import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoginPage from './pages/auth/Login'
import Home from './pages/home/Home'
import SignUp from './pages/auth/SignUp'
import { useLocation } from 'react-router-dom'

import { Routes, Route } from "react-router-dom"

import CreateBlog from './pages/blogs/write/CreateBlog'
import UpdateBlog from './pages/blogs/write/UpdateBlog'

import UserProfile from './pages/user/UserProfile'
import UpdateProfile from './pages/user/UpdateProfile'

import BlogDetails from './pages/blogs/BlogDetails'

import Explore from './pages/explore/Explore'
import Category from './pages/explore/Category'
import BlogByCategory from './pages/explore/BlogByCategory'
import Latest from './pages/explore/Latest'
import Trending from './pages/explore/Trending'
import EditorPick from './pages/explore/EditorPick'
import Users from './pages/explore/Users'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAllBlogs from './pages/admin/blogs/AdminAllBlogs'
import TrendingBlogs from "./pages/admin/blogs/TrendingBlogs"
import LatestBlogs from "./pages/admin/blogs/LatestBlogs"
import AdminBlogDetails from './pages/admin/blogs/AdminBlogDetails'
import AdminUserDetailPage from './pages/admin/users/AdminUserDetailPage'
import AdminAllUsers from './pages/admin/users/AdminAllUser'
import UserAllBlogs from './pages/admin/users/UserAllBlogs'

import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

import VerifyEmail from './pages/auth/VerifyEmail'
import PasswordReset from './pages/auth/PasswordReset'

function App() {

  const location = useLocation();
  const noFooterAndNav = ["/sign-in", "/sign-up", "/verify-email", "/password-reset"].includes(location.pathname);

  return (
    <div>
      {!noFooterAndNav && <Navbar />}

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/latest" element={<Latest />} />
        <Route path="/explore/trending" element={<Trending />} />
        <Route path="/explore/authors" element={<Users />} />
        <Route path="/explore/editor-pick" element={<EditorPick />} />
        <Route path="/explore/category" element={<Category />} />
        <Route path="/explore/category/:category" element={<BlogByCategory />} />


        {/* Authenticated User Routes */}
        <Route element={<ProtectedRoute />}>

          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />

          <Route path="/blog/:slug" element={<BlogDetails />} />

          <Route path="/blog/create" element={<CreateBlog />} />
          <Route path="/blog/update/:slug" element={<UpdateBlog />} />

        </Route>


        {/* Admin Only Routes */}
        <Route element={<AdminRoute />}>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/blogs" element={<AdminAllBlogs />} />
          <Route path="/admin/users" element={<AdminAllUsers />} />

          <Route path="/admin/blogs/trending" element={<TrendingBlogs />} />
          <Route path="/admin/blogs/latest" element={<LatestBlogs />} />

          <Route path="/admin/blogs/details/:slug" element={<AdminBlogDetails />} />

          <Route path="/admin/user/details/:id" element={<AdminUserDetailPage />} />
          <Route path="/admin/user/:userId/blogs" element={<UserAllBlogs />} />

        </Route>

      </Routes>

      {!noFooterAndNav && <Footer />}
    </div>
  )
}

export default App