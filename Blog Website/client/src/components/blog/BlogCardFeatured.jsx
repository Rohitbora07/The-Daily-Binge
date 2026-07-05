import { motion } from "motion/react";
import { Eye, Heart, Clock, Bookmark, ArrowRight } from "lucide-react";

export default function BlogCardFeatured({ blog }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="flex flex-col lg:flex-row">
                <div
                    className="lg:w-[52%] overflow-hidden flex-shrink-0"
                    style={{ aspectRatio: "16/10" }}
                >
                    <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                <div className="flex flex-col justify-center p-7 lg:p-10 flex-1">
                    <div className="flex items-center gap-2.5 mb-4">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-[#0077CC] px-3 py-1 rounded-lg">
                            Featured
                        </span>
                        <span className="text-[10px] font-semibold text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-lg">
                            {blog.category}
                        </span>
                    </div>

                    <h2 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-[#0077CC] transition-colors duration-200">
                        {blog.title}
                    </h2>

                    <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-6">
                        {blog.excerpt}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={blog.author.profileImg}
                            alt={blog.author.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-100"
                        />
                        <div>
                            <p className="text-sm font-semibold text-stone-800">
                                {blog.author.name}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                                <span>{blog.date}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={11} />
                                    {blog.readTime} min read
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-stone-100">
                        <div className="flex items-center gap-4 text-xs text-stone-400">
                            <span className="flex items-center gap-1.5">
                                <Eye size={13} />
                                {(blog.views / 1000).toFixed(1)}k
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Heart size={13} />
                                {blog.likes}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Bookmark size={13} />
                                {blog.bookmarks}
                            </span>
                        </div>

                        <motion.button
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:text-[#005FA3] transition-colors"
                        >
                            Read article
                            <ArrowRight size={15} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}