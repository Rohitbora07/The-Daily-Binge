import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Heart,MessageSquare,Bookmark,CheckCircle2,Trash2,Shield,Ban,MapPin, XCircle,Calendar,FileText,Users,Mail} from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa"
import { useEffect } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { ADMIN_GET_USER_DETAILS_ROUTE } from "../../constants/route";
import DeleteModal from "../../components/general/DeleteModal";

export default function AdminUserDetailPage() {

    const { id } = useParams()
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [restrictionReason, setRestrictionReason] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null)


    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                setLoading(true)
                const { data } = await api.get(ADMIN_GET_USER_DETAILS_ROUTE(id))
                console.log(data)
                setUser(data.user)
                setCurrentStatus(data.user.status || "active")
                setCurrentRole(data.user.role)
            } catch (error) {
                console.log(error.response.data.message)
            } finally {
                setLoading(false)
            }
        }
        getCurrentUser()
    }, [id])

    const handleStatusChange = async (newStatus) => {
        setStatusLoading(true);
        setCurrentStatus(newStatus);
    };


    const handleDelete = async () => {
        setDeleteLoading(true);
    };

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
                            {/* Optional Banner */}
                            <div className="h-32 bg-gradient-to-r from-stone-200 to-stone-300 relative">
                                {user.backgroundImg && (
                                    <img
                                        src={user.backgroundImg}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="p-6 pt-0 relative">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
                                    <div className="flex items-end gap-4">
                                        <img
                                            src={user.profileImg || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white flex-shrink-0"
                                        />
                                        <div className="mb-1">
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-xl sm:text-2xl font-bold text-stone-800 leading-snug">
                                                    {user.name}
                                                </h1>
                                                {user.isEmailVerified && (
                                                    <span title="Verified Email" className="text-[#0077CC]">
                                                        <CheckCircle2 size={18} className="fill-[#E0F0FF]" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                                                <Mail size={13} className="text-stone-400" /> {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1 ${currentStatus === "active"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                            }`}>
                                            {currentStatus === "active" ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                                            {currentStatus.toUpperCase()}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200
                                            }`}>
                                            <Shield size={12} /> {currentRole.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                            Biography
                                        </h3>
                                        <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            {user.bio || "No biography provided by this user."}
                                        </p>
                                    </div>

                                    {/* Meta Details & Socials */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-100 text-xs">
                                            <div className="flex items-center text-stone-600 gap-2">
                                                <MapPin size={14} className="text-stone-400" />
                                                <span className="font-medium text-stone-400">Location:</span>
                                                <span className="font-semibold text-stone-800">{user.location || "Not specified"}</span>
                                            </div>
                                            <div className="flex items-center text-stone-600 gap-2">
                                                <Calendar size={14} className="text-stone-400" />
                                                <span className="font-medium text-stone-400">Joined:</span>
                                                <span className="font-semibold text-stone-800">
                                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex flex-col justify-center space-y-2 text-xs">
                                            <span className="font-medium text-stone-400 mb-1">Connected Accounts:</span>
                                            <div className="flex items-center gap-3 text-stone-600">
                                                {user.github && (
                                                    <a href={user.github} target="_blank" rel="noreferrer" className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium">
                                                        <FaGithub size={14} /> GitHub
                                                    </a>
                                                )}
                                                {user.twitter && (
                                                    <a href={user.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-1 font-medium">
                                                        <FaTwitter size={14} /> Twitter
                                                    </a>
                                                )}
                                                {user.linkedin && (
                                                    <a href={user.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors flex items-center gap-1 font-medium">
                                                        <FaLinkedin size={14} /> LinkedIn
                                                    </a>
                                                )}
                                                {user.instagram && (
                                                    <a href={user.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors flex items-center gap-1 font-medium">
                                                        <FaInstagram size={14} /> Instagram
                                                    </a>
                                                )}
                                                {!user.github && !user.twitter && !user.linkedin && !user.instagram && (
                                                    <span className="text-stone-400 italic">No social links linked</span>
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
                                        {["active", "blocked"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(status)}
                                                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${currentStatus === status
                                                    ? status === "active"
                                                        ? "bg-[#0077CC] text-white border-[#0077CC] shadow-sm"
                                                        : "bg-rose-600 text-white border-rose-600 shadow-sm"
                                                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                                                    }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditional Reason Input if Blocked */}
                                {currentStatus === "blocked" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-1.5 pt-1"
                                    >
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
                                        <button
                                            onClick={() => handleStatusChange("blocked")}
                                            className="w-full py-1.5 bg-rose-600 text-white text-[11px] font-semibold rounded-lg hover:bg-rose-700 transition"
                                        >
                                            Save Reason
                                        </button>
                                    </motion.div>
                                )}

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

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.3 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 space-y-3"
                        >
                            <h2 className="text-sm font-semibold text-stone-800 border-b border-stone-100 pb-3 flex items-center gap-2">
                                <Users size={16} className="text-stone-400" /> Network Reach
                            </h2>
                            <div className="space-y-2 text-xs">
                                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex justify-between items-center">
                                    <span className="text-stone-500 font-medium">Followers</span>
                                    <span className="font-semibold text-stone-800 text-sm">
                                        {user.totalFollowers || user.followers?.length || 0}
                                    </span>
                                </div>
                                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex justify-between items-center">
                                    <span className="text-stone-500 font-medium">Following</span>
                                    <span className="font-semibold text-stone-800 text-sm">
                                        {user.totalFollowing || user.following?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal />
                )}
            </AnimatePresence>
        </motion.div>
    );
}