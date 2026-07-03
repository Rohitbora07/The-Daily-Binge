import { motion } from "motion/react";
import { TrendingUp, Tag, Hash } from "lucide-react";

const trendingPosts = [
    {
        rank: "01",
        title: "Why TypeScript Is No Longer Optional for Serious Projects",
        category: "Technology",
        views: "11.4k",
        cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=80&fit=crop",
    },
    {
        rank: "02",
        title: "The Art of Minimalist Design in Modern Web Development",
        category: "Design",
        views: "5.8k",
        cover: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?w=80&h=80&fit=crop",
    },
    {
        rank: "03",
        title: "Building with Vite in 2025: A Complete Setup Guide",
        category: "Technology",
        views: "8.9k",
        cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=80&h=80&fit=crop",
    },
    {
        rank: "04",
        title: "Designing for Accessibility: Beyond the Basics",
        category: "Design",
        views: "2.9k",
        cover: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=80&h=80&fit=crop",
    },
];

const popularCategories = [
    { name: "Technology", count: 48, color: "#0077CC" },
    { name: "Design", count: 35, color: "#7c3aed" },
    { name: "Business", count: 22, color: "#059669" },
    { name: "Science", count: 18, color: "#d97706" },
    { name: "Culture", count: 14, color: "#e11d48" },
    { name: "Health", count: 11, color: "#0891b2" },
];

// const tags = [
//     "React", "TypeScript", "Tailwind", "Node.js", "UX Design",
//     "Productivity", "Startups", "AI", "Web Dev", "CSS",
//     "Performance", "Accessibility", "Career", "Writing",
// ];

export default function BlogSidebar({tags}) {
    return (
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">

            {/* Trending */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <TrendingUp size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">Trending now</h3>
                </div>
                <ul className="divide-y divide-stone-100">
                    {trendingPosts.map((post, i) => (
                        <motion.li
                            key={post.rank}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * i }}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors cursor-pointer group"
                        >
                            <span className="text-xl font-bold text-stone-100 font-serif w-7 flex-shrink-0 leading-none">
                                {post.rank}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-[#0077CC] transition-colors">
                                    {post.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-[#0077CC] font-medium">
                                        {post.category}
                                    </span>
                                    <span className="text-[10px] text-stone-400">
                                        · {post.views} views
                                    </span>
                                </div>
                            </div>
                            <img
                                src={post.cover}
                                alt={post.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Popular categories */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Hash size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">
                        Popular categories
                    </h3>
                </div>
                <ul className="p-4 space-y-2">
                    {popularCategories.map((cat, i) => (
                        <motion.li
                            key={cat.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * i }}
                        >
                            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group">
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                                        {cat.name}
                                    </span>
                                </div>
                                <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                                    {cat.count}
                                </span>
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Tags cloud */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Tag size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">Popular tags</h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <motion.button
                            key={tag}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: 0.03 * i }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            className="text-xs font-medium text-stone-600 bg-stone-50 hover:bg-[#E0F0FF] hover:text-[#0077CC] border border-stone-200 hover:border-[#C8D8E8] px-3 py-1.5 rounded-xl transition-all duration-200"
                        >
                            {tag}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </aside>
    );
}