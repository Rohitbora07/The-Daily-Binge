import { motion } from "motion/react";
import { Hash, BarChart2, Tag } from "lucide-react";

export default function FreshSidebar({ categories, tags, stats, activeCat, activeTag, onCatClick, onTagClick }) {
    return (
        <aside className="space-y-5">

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Hash size={14} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">Categories</h3>
                </div>
                <ul className="p-3 space-y-1">
                    {categories.map((cat, i) => (
                        <motion.li
                            key={cat.name}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.28, delay: 0.05 * i }}
                        >
                            <button
                                onClick={() => onCatClick(activeCat === cat.name ? null : cat.name)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${activeCat === cat.name
                                        ? "bg-[#E0F0FF] text-[#0077CC] font-semibold"
                                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                    }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${activeCat === cat.name ? "bg-[#0077CC] text-white" : "bg-stone-100 text-stone-400"}`}>
                                    {cat.count}
                                </span>
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Popular tags */}
            <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Tag size={14} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">Popular tags</h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <motion.button
                            key={tag}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.22, delay: 0.03 * i }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            onClick={() => onTagClick(activeTag === tag ? null : tag)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 ${activeTag === tag
                                    ? "bg-[#0077CC] text-white border-[#0077CC]"
                                    : "text-stone-600 bg-stone-50 border-stone-200 hover:bg-[#E0F0FF] hover:text-[#0077CC] hover:border-[#C8D8E8]"
                                }`}
                        >
                            #{tag}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Fresh stats */}
            <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <BarChart2 size={14} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">Fresh stats</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                    {[
                        { label: "Stories", value: stats.total },
                        { label: "Authors", value: stats.authors },
                        { label: "Top category", value: stats.topCat },
                        { label: "Avg read time", value: stats.avgRead },
                    ].map(({ label, value }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.05 * i }}
                            className="bg-stone-50 rounded-xl p-3 border border-stone-100"
                        >
                            <p className="text-sm font-bold text-stone-900 truncate">{value}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </aside>
    );
}