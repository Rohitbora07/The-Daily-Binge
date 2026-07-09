import { motion } from "motion/react";
import { Eye, Heart, Clock, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog, delay = 0 }) {
    const navigate = useNavigate()
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={()=> navigate(`/blog/${blog.slug}`)}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
            {/* Cover */}
            <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                    src={blog.coverImage.url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-lg">
                        {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                        <Clock size={11} />
                        {blog.readTime} min read
                    </span>
                </div>

                <h2 className="font-serif text-base font-bold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#0077CC] transition-colors duration-200">
                    {blog.title}
                </h2>

                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 flex-1 mb-4">
                    {blog.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={blog.author.profileImg}
                            alt={blog.author.name}
                            className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-xs font-semibold text-stone-700 leading-none">
                                {blog.author.name}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-0.5">{blog.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {blog.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bookmark size={12} />
                            {blog.bookmarks}
                        </span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}