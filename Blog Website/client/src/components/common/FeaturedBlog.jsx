import { motion } from "motion/react";
import { Star, Clock3, Calendar, Eye, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedBlog({ blog, title, Icon }) {
    const navigate = useNavigate();

    const formatted = blog?.publishedAt 
        ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

    return (
        <section className="w-full max-w-7xl mx-auto mb-10 md:mb-16">
            <div className="flex items-center gap-2.5 mb-5 md:mb-6">
                <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50 shrink-0">
                    {Icon && <Icon size={13} className="text-[#0077CC]" />}
                </div>
                <h2 className="text-lg md:text-xl font-serif font-medium tracking-tight text-stone-900">{title}</h2>
            </div>

            <motion.div
                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
                <div className="relative h-60 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden bg-stone-100">
                    <motion.img
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                        src={blog?.coverImage?.url}
                        alt={blog?.title || "Featured Blog"}
                        className="w-full h-full object-cover transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-950/5 to-transparent" />

                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                        <span className="px-2.5 py-1 rounded-md bg-[#E0F0FF]/95 backdrop-blur-sm text-[#005FA3] border border-[#C8D8E8] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                            {blog?.category || "General"}
                        </span>
                    </div>
                </div>

                <div className="p-5 sm:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug mb-5 lg:mb-6 group-hover:text-[#0077CC] transition-colors duration-200 line-clamp-2 sm:line-clamp-none">
                        {blog?.title}
                    </h3>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-5 lg:pt-6 border-t border-stone-100">
                        
                        <div className="flex items-center gap-3">
                            <img
                                src={blog?.author?.profileImg}
                                alt={blog?.author?.name}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-stone-100 shrink-0 bg-stone-50"
                            />
                            <div className="min-w-0">
                                <p className="font-semibold text-stone-900 text-sm truncate">{blog?.author?.name}</p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400 mt-0.5">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Clock3 size={12} />
                                        {blog?.readTime || "0"} min read
                                    </span>
                                    {formatted && (
                                        <>
                                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-stone-300" />
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Calendar size={12} />
                                                {formatted}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-between lg:justify-end gap-6 border-t border-stone-50 pt-4 lg:pt-0 lg:border-none">
                            <div className="flex items-center gap-4 text-xs text-stone-400 font-medium">
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Eye size={13} />
                                    {blog?.views || 0}
                                </span>
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Heart size={13} />
                                    {blog?.likes || 0}
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