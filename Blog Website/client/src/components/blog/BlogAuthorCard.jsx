import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogAuthorCard({ author, compact = false }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={
                compact
                    ? "p-4"
                    : "bg-white border border-stone-200 rounded-2xl shadow-sm p-7"
            }
        >
            <div
                className={
                    compact
                        ? "flex items-center gap-3"
                        : "flex flex-col sm:flex-row gap-6 items-start"
                }
            >
                <img
                    src={author.profileImg}
                    alt={author.name}
                    className={
                        compact
                            ? "w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            : "w-16 h-16 rounded-2xl object-cover ring-2 ring-stone-100 flex-shrink-0"
                    }
                />

                <div className="flex-1 min-w-0">
                    <p
                        className={
                            compact
                                ? "text-sm font-semibold text-stone-800 truncate"
                                : "text-lg font-bold text-stone-900 font-serif"
                        }
                    >
                        {author.name}
                    </p>

                    <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {author.role}
                    </p>

                    {!compact && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/profile/${author._id}`)}
                            className="mt-4 flex text-sm items-center gap-2 font-semibold text-white bg-[#0077CC] hover:bg-[#005FA3] px-5 py-2 rounded-xl transition-colors"
                        >
                            Go to profile <ArrowRight size={16} />
                        </motion.button>
                    )}
                </div>

                {compact && (
                    <button
                        onClick={() => navigate(`/profile/${author._id}`)}
                        className="text-xs text-[#0077CC] font-semibold whitespace-nowrap"
                    >
                        View
                    </button>
                )}
            </div>
        </motion.div>
    );
}