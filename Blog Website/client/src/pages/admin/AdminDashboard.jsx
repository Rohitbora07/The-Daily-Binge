import { motion } from "motion/react";
import {
    Users, FileText, Eye, MessageSquare,
    ArrowRight, FilePlus, Star,
    UserMinus, FileMinus
} from "lucide-react";
import AdminStatsCard from "../../components/admin/AdminStatsCard";

const stats = [
    { icon: Users, label: "Total users", value: "8,420", change: 6, color: "#0077CC" },
    { icon: FileText, label: "Total posts", value: "2,148", change: 9, color: "#7c3aed" },
    { icon: Eye, label: "Total views", value: "1.2M", change: 14, color: "#059669" },
    { icon: MessageSquare, label: "Comments", value: "9,304", change: -2, color: "#d97706" },
];

const recentUsers = [
    { name: "James Okafor", email: "james@mail.com", role: "Writer", joined: "2h ago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
    { name: "Priya Nair", email: "priya@mail.com", role: "Reader", joined: "5h ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
    { name: "Tom Brennan", email: "tom@mail.com", role: "Writer", joined: "1d ago", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
    { name: "Alex Morgan", email: "alex@mail.com", role: "Admin", joined: "2d ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
];

const recentBlogs = [
    { title: "Why TypeScript Is No Longer Optional", author: "Sarah Chen", status: "Published", date: "Jun 18" },
    { title: "Building with Vite in 2025", author: "James Okafor", status: "Published", date: "Jun 10" },
    { title: "A Beginner's Guide to Motion Design", author: "Alex Morgan", status: "Pending", date: "Jun 26" },
    { title: "State Management in 2025", author: "Tom Brennan", status: "Draft", date: "Jun 25" },
];

const statusStyles = {
    Published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Draft: "bg-stone-100 text-stone-500 border-stone-200",
};

const quickActions = [
    { icon: UserMinus, label: "Delete user", color: "#EF4444", bg: "#FEE2E2" },
    { icon: FilePlus, label: "New category", color: "#7c3aed", bg: "#f5f3ff" },
    { icon: FileMinus, label: "Delete post", color: "#EF4444", bg: "#FEE2E2" },
    { icon: Star, label: "Make Blog Featured", color: "#f59e0b", bg: "#f1f5f9" },
];

export default function AdminDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50"
        >
            {/* Header */}
            <header className="bg-white border-b border-stone-100 sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
                    <h1 className="text-sm font-semibold text-stone-800">Admin dashboard</h1>
                    <span className="text-xs text-stone-400 hidden sm:inline">
                        Welcome back, Alex
                    </span>
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

                {/* Stats grid — 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {stats.map((s, i) => (
                        <AdminStatsCard key={s.label} {...s} delay={0.05 * i} />
                    ))}
                </div>

                {/* Quick actions — wraps on small screens */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 sm:p-5"
                >
                    <h2 className="text-sm font-semibold text-stone-800 mb-4">Quick actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {quickActions.map(({ icon: Icon, label, color, bg }) => (
                            <motion.button
                                key={label}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
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

                {/* Two-column: recent blogs + recent users — stacks on mobile/tablet */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

                    {/* Recent blogs */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-stone-100">
                            <h2 className="text-sm font-semibold text-stone-800">Recent posts</h2>
                            <button className="flex items-center gap-1 text-xs text-[#0077CC] hover:text-[#005FA3] font-medium transition-colors">
                                View all <ArrowRight size={11} />
                            </button>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {recentBlogs.map((blog) => (
                                <li key={blog.title} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-800 truncate">
                                            {blog.title}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-0.5 truncate">
                                            {blog.author} · {blog.date}
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

                    {/* Recent users */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-stone-100">
                            <h2 className="text-sm font-semibold text-stone-800">Recent users</h2>
                            <button className="flex items-center gap-1 text-xs text-[#0077CC] hover:text-[#005FA3] font-medium transition-colors">
                                View all <ArrowRight size={11} />
                            </button>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {recentUsers.map((user) => (
                                <li key={user.email} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                                    <img
                                        src={user.avatar}
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
                                        <span className="text-[10px] text-stone-300">{user.joined}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Simple chart placeholder — responsive bars */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 }}
                    className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 sm:p-5"
                >
                    <h2 className="text-sm font-semibold text-stone-800 mb-5">
                        Platform activity — last 7 days
                    </h2>
                    <div className="flex items-end gap-2 sm:gap-3 h-28 sm:h-32">
                        {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.4, delay: 0.05 * i, ease: "easeOut" }}
                                style={{ height: `${h}%`, originY: 1 }}
                                className="flex-1 bg-[#E0F0FF] hover:bg-[#0077CC] rounded-t-lg transition-colors duration-200 min-w-0"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-stone-400">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                            <span key={d} className="flex-1 text-center">{d}</span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}