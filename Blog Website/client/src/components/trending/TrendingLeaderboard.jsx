import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Heart, Bookmark, Clock, Search, ChevronDown } from "lucide-react";

const catOptions = ["All", "Technology", "Design", "Business", "Health", "Culture", "Travel"];

export default function TrendingLeaderboard({ blogs }) {
    const [search, setSearch] = useState("");
    const [catOpen, setCatOpen] = useState(false);
    const [cat, setCat] = useState("All");
    const [saved, setSaved] = useState({});

    const toggleSave = (id) => setSaved(prev => ({ ...prev, [id]: !prev[id] }));

    const filtered = blogs.filter(b => {
        const matchCat = cat === "All" || b.category === cat;
        const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div>
            {/* Search + category filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search trending articles…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all"
                    />
                </div>

                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setCatOpen(!catOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-600 hover:border-stone-300 transition-all w-full sm:w-auto justify-between sm:justify-start"
                    >
                        {cat}
                        <ChevronDown size={13} className={`text-stone-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                        {catOpen && (
                            <motion.ul
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 left-0 sm:left-auto sm:w-44 top-full mt-1.5 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden"
                            >
                                {catOptions.map(o => (
                                    <li key={o}>
                                        <button
                                            onClick={() => { setCat(o); setCatOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-stone-50 ${cat === o ? "text-[#0077CC] font-medium bg-[#E0F0FF]" : "text-stone-700"}`}
                                        >
                                            {o}
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* List */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-16 text-center px-4"
                        >
                            <p className="text-sm font-semibold text-stone-700 mb-1">No articles found</p>
                            <p className="text-xs text-stone-400">Try a different search or category.</p>
                        </motion.div>
                    ) : (
                        <motion.div key={search + cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                            {filtered.map((blog, i) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.03 * i }}
                                    className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50/70 transition-colors cursor-pointer"
                                >
                                    {/* Rank */}
                                    <span className="font-serif text-xl sm:text-2xl font-black text-stone-100 w-8 flex-shrink-0 text-center select-none">
                                        {blog.rank}
                                    </span>

                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={blog.cover}
                                            alt={blog.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-semibold text-[#0077CC] bg-[#E0F0FF] px-2 py-0.5 rounded-md">
                                                {blog.category}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1 text-[10px] text-stone-400">
                                                <Clock size={10} /> {blog.readTime} min
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-stone-800 line-clamp-1 group-hover:text-[#0077CC] transition-colors">
                                            {blog.title}
                                        </p>
                                        <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                                            {blog.author} · {blog.date}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden sm:flex items-center gap-3 text-xs text-stone-400 flex-shrink-0">
                                        <span className="flex items-center gap-1">
                                            <Eye size={12} /> {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart size={12} /> {blog.likes}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 1.35 }}
                                        onClick={e => { e.stopPropagation(); toggleSave(blog.id); }}
                                        className={`flex-shrink-0 transition-colors ${saved[blog.id] ? "text-[#0077CC]" : "text-stone-300 hover:text-[#0077CC]"}`}
                                    >
                                        <Bookmark size={15} fill={saved[blog.id] ? "currentColor" : "none"} />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}