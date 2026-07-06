import { useState } from "react";
import { motion } from "motion/react";
import { Eye, Heart, Bookmark, Clock, ArrowRight } from "lucide-react";

const badges = {
    "🔥 Hot": { label: "🔥 Hot", cls: "bg-orange-50  text-orange-500  border-orange-100" },
    "📈 Rising": { label: "📈 Rising", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    "⭐ Editor's Pick": { label: "⭐ Editor's Pick", cls: "bg-amber-50   text-amber-600   border-amber-100" },
    "💎 Popular": { label: "💎 Popular", cls: "bg-purple-50  text-purple-600  border-purple-100" },
    "🏆 Top Story": { label: "🏆 Top Story", cls: "bg-[#E0F0FF]  text-[#0077CC]   border-[#C8D8E8]" },
};

const rankColors = ["#0077CC", "#7c3aed", "#059669"];

export default function TrendingHeroCard({ blog, rank, delay = 0 }) {
    const [saved, setSaved] = useState(false);
    const [likes, setLikes] = useState(blog.likes);
    const [liked, setLiked] = useState(false);
    const badge = badges[blog.badge];

    return (
        <motion.article
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
            {/* Cover */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                    src={blog.cover}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Giant faded rank number behind image */}
                <div
                    className="absolute -bottom-3 -left-2 font-serif font-black text-white/10 select-none pointer-events-none leading-none"
                    style={{ fontSize: "clamp(5rem, 14vw, 9rem)" }}
                >
                    #{rank}
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top badges row */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${badge.cls}`}>
                        {badge.label}
                    </span>
                    <span className="text-[10px] font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                        {blog.category}
                    </span>
                </div>

                {/* Rank badge bottom-left */}
                <div
                    className="absolute bottom-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center font-serif font-black text-white text-sm shadow-md"
                    style={{ background: rankColors[rank - 1] ?? "#0D1B2A" }}
                >
                    #{rank}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
                <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#0077CC] transition-colors duration-200">
                    {blog.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">
                    {blog.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-stone-700 truncate">{blog.author.name}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                                <span>{blog.date}</span>
                                <span>·</span>
                                <Clock size={10} />
                                <span>{blog.readTime} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats + actions */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-xs text-stone-400">
                            <Eye size={12} /> {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); setLiked(!liked); setLikes(n => liked ? n - 1 : n + 1); }}
                            className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-stone-400 hover:text-red-400"}`}
                        >
                            <motion.span whileTap={{ scale: 1.4 }} transition={{ duration: 0.15 }}>
                                <Heart size={13} fill={liked ? "currentColor" : "none"} />
                            </motion.span>
                            {likes}
                        </button>

                        <motion.button
                            whileTap={{ scale: 1.35 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
                            className={`transition-colors ${saved ? "text-[#0077CC]" : "text-stone-400 hover:text-[#0077CC]"}`}
                        >
                            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                        </motion.button>

                        <ArrowRight size={14} className="text-stone-300 group-hover:text-[#0077CC] transition-colors" />
                    </div>
                </div>
            </div>
        </motion.article>
    );
}