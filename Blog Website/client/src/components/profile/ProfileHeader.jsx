import { motion } from "motion/react";
import { MapPin, CalendarDays, CheckCircle } from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa"


export default function ProfileHeader({ user }) {
    const makeDate = (date) => {
        const createdAt = new Date(date);
        const options = { year: 'numeric', month: 'long' };
        return createdAt.toLocaleDateString(undefined, options);
    }
    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full overflow-hidden bg-stone-100"
                style={{ aspectRatio: "21/5" }}
            >
                <img
                    src={user.backgroundImg}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                {/* Avatar + action row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <img
                            src={user.profileImg}
                            alt={user.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md"
                        />
                    </motion.div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            {user.isVerified ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                    <CheckCircle size={14} className="text-emerald-600" />
                                    Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                    <CheckCircle size={14} className="text-red-600" />
                                    Not Verified
                                </span>
                            )}
                        </motion.div>
                    </div>

                </div>

                {/* Name + bio block */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="pb-7 border-b border-stone-100"
                >
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                            {user.name}
                        </h1>
                        <span className="text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-lg">
                            {user.role.toUpperCase()}
                        </span>
                    </div>

                    <p className="text-stone-500 text-sm leading-relaxed max-w-xl mb-5">
                        {user.bio}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                            <MapPin size={13} className="text-stone-400" />
                            {user.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-stone-500">
                            <CalendarDays size={13} className="text-stone-400" />
                            Joined {user && makeDate(user.createdAt)}
                        </span>
                    </div>

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
                </motion.div>
            </div>
        </div>
    );
}