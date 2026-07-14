import { motion } from "motion/react";
import { Eye, Heart, Clock, Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function BlogCardFeatured({ blog, title, Icon }) {
    const navigate = useNavigate();

    return (
        <section className="w-full max-w-7xl mx-auto mb-10 md:mb-16">
            <div className="flex items-center gap-2.5 mb-5 md:mb-6">
                <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50 shrink-0">
                    {Icon && <Icon size={13} className="text-[#0077CC]" />}
                </div>
                <h2 className="text-lg md:text-xl font-serif font-medium tracking-tight text-stone-900">{title}</h2>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    <div className="lg:col-span-6 xl:col-span-7 overflow-hidden relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[400px]">
                        <img
                            src={blog?.coverImage?.url}
                            alt={blog?.title || "Featured Blog"}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        />
                    </div>

                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-white">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {blog?.isFeatured && (
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-[#0077CC] px-2.5 py-1 rounded-md">
                                        Featured
                                    </span>
                                )}
                                <span className="text-[10px] font-semibold tracking-wide uppercase text-[#0077CC] bg-[#E0F0FF] px-2.5 py-1 rounded-md">
                                    {blog?.category}
                                </span>
                            </div>

                            <h2 className="font-serif text-xl sm:text-2xl xl:text-3xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-[#0077CC] transition-colors duration-200 line-clamp-2 sm:line-clamp-none">
                                {blog?.title}
                            </h2>

                            <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-6">
                                {blog?.excerpt}
                            </p>

                            <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                <img
                                    src={blog?.author?.profileImg}
                                    alt={blog?.author?.name}
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-100 shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-stone-800 truncate">
                                        {blog?.author?.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5 whitespace-nowrap">
                                        <span>{blog?.date}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} />
                                            {blog?.readTime} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto gap-4">
                            <div className="flex items-center gap-3.5 sm:gap-4 text-xs text-stone-400">
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Eye size={13} className="shrink-0" />
                                    {blog?.views ? (blog.views / 1000).toFixed(1) : "0"}k
                                </span>
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Heart size={13} className="shrink-0" />
                                    {blog?.likes || 0}
                                </span>
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Bookmark size={13} className="shrink-0" />
                                    {blog?.bookmarks || 0}
                                </span>
                            </div>

                            <motion.button
                                onClick={() => blog?.slug && navigate(`/blog/${blog.slug}`)}
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:text-[#005FA3] transition-colors shrink-0"
                            >
                                Read Article
                                <ArrowRight size={15} />
                            </motion.button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}