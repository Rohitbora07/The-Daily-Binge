import { motion } from "motion/react";
import { MapPin, CalendarDays, CheckCircle, Edit3, CircleCheckBig } from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ user, isEditable }) {
    const navigate = useNavigate();
    const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }) : "";

    return (
        <div className="w-full bg-white">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full relative overflow-hidden bg-stone-100 aspect-[21/9] sm:aspect-[21/6] md:aspect-[21/5]"
            >
                {user?.backgroundImg ? (
                    <img
                        src={user.backgroundImg}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-stone-200 to-stone-300" />
                )}
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-14 lg:-mt-16 mb-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="shrink-0"
                    >
                        {user?.profileImg ? (
                            <img
                                src={user.profileImg}
                                alt={user?.name || "User Profile"}
                                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-stone-100"
                            />
                        ) : (
                            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-md bg-stone-300 flex items-center justify-center font-bold text-xl text-stone-600">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </motion.div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="flex flex-wrap gap-2 items-center"
                        >
                            {user?.isEmailVerified ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                    <CheckCircle size={13} className="text-emerald-600" />
                                    Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                    <CheckCircle size={13} className="text-red-500" />
                                    Not Verified
                                </span>
                            )}

                            {!user?.isEmailVerified && isEditable && (
                                <button
                                    onClick={() => navigate("/verify")}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 transition-colors"
                                >
                                    <CircleCheckBig size={13} className="text-amber-600" />
                                    Verify Now
                                </button>
                            )}

                            {isEditable && (
                                <button
                                    onClick={() => navigate("/profile/update")}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 hover:bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 transition-colors"
                                >
                                    <Edit3 size={13} className="text-blue-600" />
                                    Edit Profile
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="pb-8 border-b border-stone-200/60"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 font-serif">
                            {user?.name || "Anonymous User"}
                        </h1>
                        {user?.role && (
                            <span className="text-[10px] font-bold tracking-wider text-[#0077CC] bg-[#E0F0FF] px-2.5 py-0.5 rounded-md uppercase">
                                {user.role}
                            </span>
                        )}
                    </div>

                    {user?.bio && (
                        <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl mb-5">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
                        {user?.location && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                                <MapPin size={13} className="text-stone-400" />
                                {user.location}
                            </span>
                        )}
                        {user?.createdAt && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                                <CalendarDays size={13} className="text-stone-400" />
                                Joined {formattedDate}
                            </span>
                        )}
                    </div>

                    <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/60 w-full max-w-2xl">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 block">
                            Connected Accounts
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {user?.github && (
                                <a href={user.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-all shadow-xs">
                                    <FaGithub size={13} className="text-stone-500" /> GitHub
                                </a>
                            )}
                            {user?.twitter && (
                                <a href={user.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-blue-500 hover:border-blue-300 transition-all shadow-xs">
                                    <FaTwitter size={13} className="text-blue-400" /> Twitter
                                </a>
                            )}
                            {user?.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-blue-700 hover:border-blue-400 transition-all shadow-xs">
                                    <FaLinkedin size={13} className="text-blue-600" /> LinkedIn
                                </a>
                            )}
                            {user?.instagram && (
                                <a href={user.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:text-pink-600 hover:border-pink-300 transition-all shadow-xs">
                                    <FaInstagram size={13} className="text-pink-500" /> Instagram
                                </a>
                            )}
                            {!user?.github && !user?.twitter && !user?.linkedin && !user?.instagram && (
                                <span className="text-xs text-stone-400 italic py-1">No linked social records found</span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}