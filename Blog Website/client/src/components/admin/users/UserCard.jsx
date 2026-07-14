import { motion } from "motion/react";
import { Eye, Heart, Edit2, CheckSquare, Square, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserCard({ user, index, isSelected, onSelect }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03, duration: 0.35, ease: "easeOut" }}
            className={`group relative flex items-center bg-white rounded-xl border transition-all duration-300 h-24 overflow-hidden pl-2 pr-4 ${
                isSelected 
                    ? "border-stone-300 bg-stone-50/60 shadow-sm" 
                    : "border-stone-200/70 hover:border-stone-300 shadow-sm hover:shadow-md hover:bg-stone-50/20"
            }`}
        >
  
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0077CC]" />
            )}


            <button 
                onClick={onSelect}
                className={`p-2 transition-colors duration-200 flex-shrink-0 focus:outline-none ${
                    isSelected ? "text-[#0077CC]" : "text-stone-300 group-hover:text-stone-400"
                }`}
            >
                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>

            {/* Compact Geometric Aspect Cover Image */}
            <div className="relative w-20 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-stone-100 border border-stone-200/40 ml-1">
                <img
                    src={user.profileImg || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=150&fit=crop"}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="flex-1 min-w-0 ml-4 flex items-center justify-between gap-4 h-full">
                <div className="min-w-0 py-2 flex flex-col justify-center">

                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-medium text-stone-500 tracking-wide">
                            {user.status || "-"}
                        </span>
                        
                        {user.isEmailVerified && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-stone-300" />
                                <span className="text-[10px] font-semibold text-amber-600 tracking-wide flex items-center gap-0.5">
                                    <Star size={10} fill="currentColor" className="mt-[-1px]" /> Verified
                                </span>
                            </>
                        )}
                    </div>

                    <h3 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="font-sans font-medium text-stone-800 leading-snug text-sm hover:text-[#0077CC] transition-colors duration-150 cursor-pointer truncate max-w-md sm:max-w-xl"
                    >
                        {user.name}
                    </h3>
                </div>


                <div className="flex items-center gap-6 flex-shrink-0 h-full">
                    

                    <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-stone-400 font-mono transition-opacity duration-200 group-hover:opacity-40">
                        <span className="flex items-center gap-1.5"><Heart size={13} className="text-stone-300" /> {user.totalLikes || "0"}</span>
                        <span className="flex items-center gap-1.5"><Eye  size={13} className="text-stone-300" /> {user.totalViews || "-"}m</span>
                    </div>


                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white sm:bg-transparent pl-2">
                        <div 
                            className={`p-2 rounded-lg transition-colors border ${
                                user.isFeatured 
                                ? "bg-amber-50/60 border-amber-200 text-amber-500 hover:bg-amber-100/60" 
                                : "border-transparent text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            }`}
                        >
                            <Star size={14} fill={user.isFeatured ? "currentColor" : "transparent"} />
                        </div>

                        <button 
                            onClick={() => navigate(`/admin/user/details/${user._id}`)}
                            title="Edit"
                            className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors border border-transparent"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default UserCard
