import { motion, AnimatePresence } from "motion/react";
import { Eye, Heart, Clock, Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function UserCard ({ user, delay=0 }) {
    const navigate = useNavigate();
    console.log("user", user._id)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/profile/${user._id}`)}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-md cursor-pointer"
        >

            <div className="overflow-hidden aspect-video w-full bg-stone-100">
                <img
                    src={user.backgroundImg}
                    alt={user.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wide text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-md uppercase">
                        {user.status}
                    </span>
                </div>

                <h2 className="font-serif text-base font-bold text-stone-900 leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[#0077CC]">
                    {user.name}
                </h2>


                <div className="flex items-center justify-between pt-4 mt-auto border-t border-stone-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={user.profileImg}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-100"
                        />
                        <div>
                            <p className="text-xs font-semibold text-stone-800 leading-none">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-1">{user.date}</p>
                        </div>
                    </div>

                    <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex items-center gap-1 py-2 px-2 rounded-full bg-[#0077CC] text-xs text-white font-medium">
                        <span className="flex items-center gap-1">Profile</span>
                        <ArrowRight size={13} className="text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default UserCard