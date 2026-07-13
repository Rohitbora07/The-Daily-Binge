import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Bookmark, CheckCircle2, Trash2, Shield, Ban, MapPin, XCircle, Calendar, FileText, Mail, ArrowRight } from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa"
import { useEffect } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { ADMIN_GET_USER_DETAILS_ROUTE, ADMIN_GET_USER_BLOGS_ROUTE, ADMIN_DELETE_ONE_USER_ROUTE, ADMIN_BLOCK_USER_ROUTE, ADMIN_UNBLOCK_USER_ROUTE } from "../../constants/route";
import DeleteModal from "../../components/general/DeleteModal";
import { useNavigate } from "react-router-dom";

const statusStyles = {
    Published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Draft: "bg-stone-100 text-stone-500 border-stone-200",
};

export default function AdminUserDetailPage() {

    const { id } = useParams()
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [restrictionReason, setRestrictionReason] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedStatus, setSelectedStatus] = useState("");

    const [user, setUser] = useState(null)
    const [userBlogs, setUserBlogs] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                setLoading(true)
                const [userRes, blogRes] = await Promise.all([
                    api.get(ADMIN_GET_USER_DETAILS_ROUTE(id)),
                    api.get(ADMIN_GET_USER_BLOGS_ROUTE(id))
                ])
                console.log(userRes)
                setUser(userRes.data.user)
                setCurrentStatus(userRes.data.user.status || "active")
                setCurrentRole(userRes.data.user.role)
                console.log(blogRes)
                setUserBlogs(blogRes.data.blogs)
            } catch (error) {
                console.log(error.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }
        }
        getCurrentUser()
    }, [id])



    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const { data } = await api.patch(ADMIN_DELETE_ONE_USER_ROUTE(id))
            console.log(data)
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (newStatus === "blocked" && !restrictionReason.trim()) return
        try {
            setStatusLoading(true)
            const { data } = newStatus === "blocked" ? await api.patch(ADMIN_BLOCK_USER_ROUTE(id), { restrictionReason }) : await api.patch(ADMIN_UNBLOCK_USER_ROUTE(id))
            console.log(data)
            setCurrentStatus(data.details.status)
            setSelectedStatus("")
            setRestrictionReason("");
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setStatusLoading(false);
        }
    }



    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50 pb-12 mt-20"
        >


            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#E0F0FF] flex items-center justify-center flex-shrink-0 text-[#0077CC]">
                            <FileText size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Published Blogs</p>
                            <p className="text-lg font-semibold text-stone-800">0</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-600">
                            <Heart size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Total Likes</p>
                            <p className="text-lg font-semibold text-stone-800">{user.totalLikes || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Comments</p>
                            <p className="text-lg font-semibold text-stone-800">{0}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                            <Bookmark size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Bookmarks</p>
                            <p className="text-lg font-semibold text-stone-800">0</p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: User Profile & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.25 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                        >
                            {/* Profile Banner */}
                            <div className="h-32 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300 relative">
                                {user.backgroundImg && (
                                    <img
                                        src={user.backgroundImg}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="p-6 pt-0 relative">
                                {/* Header Content Wrapper */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-6">
                                    <div className="flex items-end gap-4">
                                        <img
                                            src={user.profileImg || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white flex-shrink-0"
                                        />
                                        <div className="mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h1 className="text-xl sm:text-2xl font-bold text-stone-800 leading-tight">
                                                    {user.name}
                                                </h1>
                                                {user.isEmailVerified && (
                                                    <span title="Verified Email" className="text-[#0077CC] shrink-0">
                                                        <CheckCircle2 size={18} className="fill-[#E0F0FF]" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-stone-500 font-mono flex items-center gap-1.5 mt-1">
                                                <Mail size={13} className="text-stone-400 shrink-0" /> {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status & Role Badges */}
                                    <div className="flex items-center gap-2 self-start sm:self-auto sm:mb-1 shrink-0">
                                        <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 shadow-2xs ${currentStatus === "active"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                            }`}>
                                            {currentStatus === "active" ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 bg-purple-50 text-purple-700 border-purple-200 shadow-2xs">
                                            <Shield size={13} /> {currentRole ? currentRole.toUpperCase() : "USER"}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                                            Biography
                                        </h3>
                                        <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/60 p-4 rounded-xl border border-stone-200/60">
                                            {user.bio || "No biography provided by this user."}
                                        </p>
                                    </div>

                                    {/* Meta Details & Socials Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        {/* Meta Info Block */}
                                        <div className="space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-200/60 flex flex-col justify-center">
                                            <div className="flex items-center text-xs text-stone-600 gap-2.5">
                                                <MapPin size={14} className="text-stone-400 shrink-0" />
                                                <span className="font-medium text-stone-400 w-14">Location:</span>
                                                <span className="font-semibold text-stone-700">{user.location || "Not specified"}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-stone-600 gap-2.5">
                                                <Calendar size={14} className="text-stone-400 shrink-0" />
                                                <span className="font-medium text-stone-400 w-14">Joined:</span>
                                                <span className="font-semibold text-stone-700">
                                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Social Accounts Interactive Badge Block */}
                                        <div className="bg-stone-50/60 p-4 rounded-xl border border-stone-200/60 flex flex-col justify-center">
                                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">
                                                Connected Accounts
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {user.github && (
                                                    <a href={user.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-all shadow-2xs">
                                                        <FaGithub size={13} className="text-stone-500" /> GitHub
                                                    </a>
                                                )}
                                                {user.twitter && (
                                                    <a href={user.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-blue-500 hover:border-blue-300 transition-all shadow-2xs">
                                                        <FaTwitter size={13} className="text-blue-400" /> Twitter
                                                    </a>
                                                )}
                                                {user.linkedin && (
                                                    <a href={user.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-blue-700 hover:border-blue-400 transition-all shadow-2xs">
                                                        <FaLinkedin size={13} className="text-blue-600" /> LinkedIn
                                                    </a>
                                                )}
                                                {user.instagram && (
                                                    <a href={user.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-pink-600 hover:border-pink-300 transition-all shadow-2xs">
                                                        <FaInstagram size={13} className="text-pink-500" /> Instagram
                                                    </a>
                                                )}
                                                {!user.github && !user.twitter && !user.linkedin && !user.instagram && (
                                                    <span className="text-xs text-stone-400 italic py-1">No linked social records found</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Admin Controls & Stats */}
                    <div className="space-y-6">
                        {/* Admin Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.25 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 space-y-5"
                        >
                            <h2 className="text-sm font-semibold text-stone-800 border-b border-stone-100 pb-3">
                                Admin Controls
                            </h2>

                            <div className="space-y-4">
                                {/* Account Status Toggle */}
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                                        Account Status
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {["active", "blocked"].map((status) => {
                                            const isSelected = selectedStatus ? selectedStatus === status : currentStatus === status;

                                            return (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setSelectedStatus(status)}
                                                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${isSelected
                                                        ? status === "active"
                                                            ? "bg-[#0077CC] text-white border-[#0077CC] shadow-sm"
                                                            : "bg-rose-600 text-white border-rose-600 shadow-sm"
                                                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                                                        }`}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {selectedStatus && selectedStatus !== currentStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 pt-1"
                                    >

                                        {selectedStatus === "blocked" && (
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold text-rose-600 block">
                                                    Restriction Reason
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={restrictionReason}
                                                    onChange={(e) => setRestrictionReason(e.target.value)}
                                                    placeholder="State reason for blocking this user..."
                                                    className="w-full text-xs p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                                />
                                            </div>
                                        )}

                                        {/* Primary Action Button - Always positioned at the bottom */}
                                        <button
                                            onClick={() => handleStatusChange(selectedStatus)}
                                            disabled={statusLoading || (selectedStatus === "blocked" && !restrictionReason.trim())}
                                            className={`w-full py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${selectedStatus === "blocked"
                                                ? "bg-rose-600 hover:bg-rose-700"
                                                : "bg-[#0077CC] hover:bg-[#005FA3]"
                                                }`}
                                        >
                                            {statusLoading ? (
                                                "Updating..."
                                            ) : selectedStatus === "blocked" ? (
                                                "Confirm & Block User"
                                            ) : (
                                                "Confirm & Activate User"
                                            )}
                                        </button>
                                    </motion.div>
                                )}

                                {/* Email Verification Status */}
                                <div className="border-t border-stone-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-stone-700">
                                            Email Verification
                                        </p>

                                        <div
                                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${user.isEmailVerified
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {user.isEmailVerified ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>Verified</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4" />
                                                    <span>Not Verified</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Account Button */}
                                <div className="border-t border-stone-100 pt-4">
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete this account
                                    </button>
                                </div>
                            </div>
                        </motion.div>



                    </div>

                </div>
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
                >
                    <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-stone-100">
                        <h2 className="text-sm font-semibold text-stone-800">User posts</h2>
                        {
                            userBlogs.length > 0 &&
                            <button onClick={() => navigate(`/admin/user/${id}/blogs`)}
                                className="flex items-center gap-1 text-xs text-[#0077CC] hover:text-[#005FA3] font-medium transition-colors">
                                View all <ArrowRight size={11} />
                            </button>
                        }

                    </div>
                    <ul className="divide-y divide-stone-100">
                        {userBlogs.length === 0 && (
                            <li className="h-40 flex flex-col items-center justify-center gap-2 text-sm text-stone-500">
                                <FileText size={22} className="text-stone-300" />
                                <span>No blogs found for this user.</span>
                            </li>
                        )}
                        {userBlogs.map((blog) => (
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
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal handleDelete={handleDelete} setShowDeleteModal={setShowDeleteModal} deleteLoading={deleteLoading} />
                )}
            </AnimatePresence>
        </motion.div>
    );

}