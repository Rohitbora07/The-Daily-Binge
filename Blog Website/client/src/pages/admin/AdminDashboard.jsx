import { motion } from "motion/react";
import { useEffect, useState } from "react";
import api from "../../api/axios"
import { ADMIN_STATS_ROUTE, ADMIN_ALL_BLOGS_ROUTE,ADMIN_ALL_USERS_ROUTE } from "../../constants/route";
import {
    Users, FileText, Eye, MessageSquare,
    ArrowRight, Star, Bookmark,
    User2,
    File,
    Clock
} from "lucide-react";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import { useNavigate } from "react-router-dom";

const statusStyles = {
    Published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Draft: "bg-stone-100 text-stone-500 border-stone-200",
};

const quickActions = [
    { icon: User2, label: "View All Users", color: "#EF4444", bg: "#FEE2E2", path: "/admin/users" },
    { icon: FileText, label: "View All Blogs", color: "#7c3aed", bg: "#f5f3ff", path: "/admin/blogs" },
    { icon: File, label: "View Trending Blogs", color: "#EF4444", bg: "#FEE2E2", path: "/admin/blogs/trending" },
    { icon: Clock, label: "View Recent Blogs", color: "#f59e0b", bg: "#f1f5f9", path: "/admin/blogs/latest" },
];

export default function AdminDashboard() {
    
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [totalBookmarks, setTotalBookmarks] = useState(0)
    const [totalBlogs, setTotalBlogs] = useState(0)
    const [totalPublishedBlogs, setTotalPublishedBlogs] = useState(0)
    const [totalDraftBlogs, setTotalDraftBlogs] = useState(0)
    const [totalFeaturedBlogs, setTotalFeaturedBlogs] = useState(0)
    const [loading, setLoading] = useState(true)
    const [allBlogs, setAllBlogs] = useState([])

    const [allUsers, setAllUsers] = useState([])

    const navigate = useNavigate()

    const stats = [
        { icon: Users, label: "Total users", value: totalUsers, change: 6, color: "#0077CC" },
        { icon: FileText, label: "Total blogs", value: totalBlogs, change: 9, color: "#7c3aed" },
        {icon: Bookmark, label: "Total bookmarks", value: totalBookmarks, change: 14, color: "#059669" },
        { icon: Eye, label: "Total views", value: totalPublishedBlogs, change: 14, color: "#059669" },
        { icon: FileText, label: "Draft blogs", value: totalDraftBlogs, change: 14, color: "#059669" },
        { icon: Star, label: "Featured blogs", value: totalFeaturedBlogs, change: 14, color: "#059669" },
        { icon: MessageSquare, label: "Comments", value: totalComments, change: -2, color: "#d97706" },
    ]
    
    useEffect(()=>{
        const getAdminStats = async () => {
            try {
                setLoading(true)
                const {data} = await api.get(ADMIN_STATS_ROUTE)
                console.log(data)
                setTotalUsers(data.users)
                setTotalComments(data.comments)
                setTotalBookmarks(data.bookmarks)
                setTotalBlogs(data.totalBlogs)
                setTotalPublishedBlogs(data.published)
                setTotalDraftBlogs(data.drafts)
                setTotalFeaturedBlogs(data.featured)

                const {data: all} = await api.get(`${ADMIN_ALL_BLOGS_ROUTE}?limit=5`)
                setAllBlogs(all.blogs || [])
                console.log(all)

                const {data: users} = await api.get(`${ADMIN_ALL_USERS_ROUTE}?limit=5`)
                setAllUsers(users.users || [])
                console.log(users)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAdminStats()
    },[])
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50/60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-[#0077CC]"></div>
            </div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50 mt-20"
        >


            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {stats.map((s, i) => (
                        <AdminStatsCard key={s.label} {...s} delay={0.05 * i} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 sm:p-5"
                >
                    <h2 className="text-sm font-semibold text-stone-800 mb-4">Quick actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {quickActions.map(({ icon: Icon, label, color, bg, path }) => (
                            <motion.button
                                key={label}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(path)}
                                className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-100 bg-stone-50 hover:bg-stone-100 transition-colors text-left min-w-0"
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: bg }}
                                >
                                    <Icon size={15} style={{ color }} />
                                </div>
                                <span className="text-xs font-semibold text-stone-700 truncate">
                                    {label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-stone-100">
                            <h2 className="text-sm font-semibold text-stone-800">Recent blogs</h2>
                            <button onClick={() => navigate("/admin/blogs")}
                            className="flex items-center gap-1 text-xs text-[#0077CC] hover:text-[#005FA3] font-medium transition-colors">
                                View all <ArrowRight size={11} />
                            </button>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {allBlogs.map((blog) => (
                                <li key={blog.title} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-800 truncate">
                                            {blog.title}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-0.5 truncate">
                                            {blog.author.name} · {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "Not published"}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border flex-shrink-0 ${statusStyles[blog.status]}`}
                                    >
                                        {blog.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                        onClick={() => navigate("/admin/users")}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-stone-100">
                            <h2 className="text-sm font-semibold text-stone-800">Recent users</h2>
                            <button className="flex items-center gap-1 text-xs text-[#0077CC] hover:text-[#005FA3] font-medium transition-colors">
                                View all <ArrowRight size={11} />
                            </button>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {allUsers.map((user) => (
                                <li key={user.email} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                                    <img
                                        src={user.profileImg}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-800 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md block mb-1">
                                            {user.role}
                                        </span>
                                        <span className="text-[10px] text-stone-300">{user.createdAt && new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}