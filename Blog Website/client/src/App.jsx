import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginPage from './components/Login'
import Home from './components/Home'
import SignUp from './components/SignUp'
import CreateBlog from './pages/writer/CreateBlog'
import { Routes, Route, useLocation } from "react-router-dom"
import WriterDashboard from './pages/writer/DashBoard'
import MyBlogs from './pages/writer/MyBlog'
import UserProfile from './pages/UserProfile'
import UpdateProfile from './pages/UpdateProfile'
import DangerZone from './components/settings/DangerZone'
import BlogDetails from './pages/BlogDetails'
import Explore from './pages/Explore'
import Category from './pages/Category'
import BlogByCategory from './pages/BlogByCategory'
import Latest from './pages/explore/Latest'
import Trending from './pages/explore/Trending'
import EditorPick from './pages/explore/EditorPick'
import UpdateBlog from './pages/writer/UpdateBlog'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogManager from './pages/admin/AdminBlogManager'
import TrendingBlogs from "./pages/admin/BlogManager/TrendingBlogs"
import LatestBlogs from "./pages/admin/BlogManager/LatestBlogs"
import AdminBlogDetails from './pages/admin/BlogManager/BlogOperations'
function App() {
  const location = useLocation()
  const hideLayout = ["/sign-in", "/sign-up","my-blogs"].includes(location.pathname);
  return (
    <div>
    {!hideLayout && <Navbar />}
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-in" element={<LoginPage/>} />
      <Route path="/sign-up" element={<SignUp/>} />
      <Route path="/blog/create" element={<CreateBlog/>} />
      <Route path="/dashboard" element={<WriterDashboard />} />
      <Route path="/user/:userId/blogs" element={<MyBlogs/>} />
      <Route path='/profile/:userId' element={<UserProfile />} />
      <Route path='/update' element={<UpdateProfile />} />
      <Route path='/profile/update' element={<UpdateProfile />} />
      <Route path='/profile/security' element={<DangerZone />} />
      <Route path='/single' element={<BlogDetails />} />
      <Route path='/blog/:slug' element={<BlogDetails />} />
      <Route path='/explore' element={<Explore />} />
      <Route path='/explore/latest' element={<Latest />} />
      <Route path='/explore/trending' element={<Trending />} />
      <Route path='/explore/editor-pick' element={<EditorPick />} />
      <Route path="/explore/category" element={<Category />} />
      <Route path="/explore/category/:category" element={<BlogByCategory />} />
      <Route path="/blog/update/:slug" element={<UpdateBlog />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/blogs" element={<AdminBlogManager />} />
      <Route path="/admin/blogs/trending" element={<TrendingBlogs />} />
      <Route path="/admin/blogs/latest" element={<LatestBlogs />} />
      <Route path="/admin/blogs/details/:slug" element={<AdminBlogDetails />} />
    </Routes>
    {!hideLayout && <Footer />}

    </div>
  )
}

export default App