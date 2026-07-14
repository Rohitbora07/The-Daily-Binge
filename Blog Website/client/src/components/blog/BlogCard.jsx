import { motion, AnimatePresence } from "motion/react";
import { Eye, Heart, Clock, Bookmark, Pen, Ellipsis, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userAuthStore from "../../store/authStore";
import { useState } from "react";

export default function BlogCard({ blog, delay = 0, onDelete, isEditable = false, setShowDeleteModal, setSelectedSlug }) {
    const navigate = useNavigate();
    const user = userAuthStore((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-md cursor-pointer"
        >
            {isEditable && (
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen((prev) => !prev);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-600 rounded-xl hover:bg-white hover:text-[#0077CC] hover:scale-105 shadow-sm transition-all duration-200"
                    >
                        <Ellipsis size={14} />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none"
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                        navigate(`/blog/update/${blog.slug}`);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#0077CC] transition-colors"
                                >
                                    <Pen size={13} />
                                    Edit blog
                                </button>
                                <hr className="my-1 border-stone-100" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSlug(blog.slug);
                                        setShowDeleteModal(true);  
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={13} />
                                    Delete blog
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="overflow-hidden aspect-video w-full bg-stone-100">
                <img
                    src={blog.coverImage.url}
                    alt={blog.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wide text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-md uppercase">
                        {blog.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                        <Clock size={13} className="text-stone-300" />
                        {blog.readTime} min read
                    </span>
                </div>

                <h2 className="font-serif text-base font-bold text-stone-900 leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[#0077CC]">
                    {blog.title}
                </h2>

                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-5">
                    {blog.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-stone-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={blog.author.profileImg}
                            alt={blog.author.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-100"
                        />
                        <div>
                            <p className="text-xs font-semibold text-stone-800 leading-none">
                                {blog.author.name}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-1">{blog.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                        <span className="flex items-center gap-1">
                            <Eye size={13} className="text-stone-300" />
                            {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart size={13} className="text-stone-300" />
                            {blog.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bookmark size={13} className="text-stone-300" />
                            {blog.bookmarks}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}