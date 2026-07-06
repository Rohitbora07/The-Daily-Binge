import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, ArrowRight } from "lucide-react";
import TrendingHeroCard from "../../components/trending/TrendingHeroCard";
import TrendingLeaderboard from "../../components/trending/TrendingLeaderboard";
import TrendingSidebar from "../../components/trending/TrendingSidebar";

/* ── Data ─────────────────────────────────────────────── */
const data = {
    Today: {
        hero: [
            {
                id: 1, rank: 1,
                title: "Why TypeScript Is No Longer Optional for Serious Projects",
                excerpt: "How TypeScript's type system saves thousands of hours in debugging and makes large codebases manageable.",
                cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
                category: "Technology", badge: "🏆 Top Story", date: "Jun 18", readTime: 9,
                views: 11430, likes: 724, bookmarks: 215,
                author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
            },
            {
                id: 2, rank: 2,
                title: "The Art of Minimalist Design in Modern Web Development",
                excerpt: "Exploring how removing friction from interfaces creates more intuitive and beautiful user experiences.",
                cover: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?w=800&h=450&fit=crop",
                category: "Design", badge: "🔥 Hot", date: "Jun 24", readTime: 6,
                views: 5820, likes: 312, bookmarks: 88,
                author: { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
            },
            {
                id: 3, rank: 3,
                title: "Building with Vite in 2025: A Complete Setup Guide",
                excerpt: "Everything you need to set up a modern Vite project with React, Tailwind, and best-in-class tooling.",
                cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
                category: "Technology", badge: "📈 Rising", date: "Jun 10", readTime: 11,
                views: 8940, likes: 519, bookmarks: 142,
                author: { name: "James Okafor", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
            },
        ],
        list: [
            { id: 4, rank: 4, title: "State Management in 2025: Do You Still Need Redux?", category: "Technology", author: "Tom Brennan", date: "Jun 25", readTime: 10, views: 7410, likes: 402, cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=160&h=160&fit=crop" },
            { id: 5, rank: 5, title: "The Psychology Behind Great Product Copy", category: "Design", author: "Priya Nair", date: "May 30", readTime: 7, views: 4210, likes: 198, cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=160&h=160&fit=crop" },
            { id: 6, rank: 6, title: "Science of Sleep: What Research Says About Deep Rest", category: "Health", author: "James Okafor", date: "Apr 18", readTime: 7, views: 5410, likes: 331, cover: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=160&h=160&fit=crop" },
            { id: 7, rank: 7, title: "Designing for Accessibility: Beyond the Basics", category: "Design", author: "Alex Morgan", date: "May 15", readTime: 6, views: 2870, likes: 177, cover: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=160&h=160&fit=crop" },
            { id: 8, rank: 8, title: "A Practical Guide to Web Performance in 2025", category: "Technology", author: "Priya Nair", date: "May 22", readTime: 7, views: 5890, likes: 311, cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&h=160&fit=crop" },
            { id: 9, rank: 9, title: "How Remote Work Changed the Way We Think About Productivity", category: "Business", author: "Tom Brennan", date: "May 20", readTime: 5, views: 3100, likes: 145, cover: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=160&h=160&fit=crop" },
            { id: 10, rank: 10, title: "CSS Container Queries Are Here — And They Change Everything", category: "Technology", author: "Alex Morgan", date: "Apr 30", readTime: 6, views: 4220, likes: 218, cover: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=160&h=160&fit=crop" },
        ],
    },
    "This Week": {
        hero: [
            { id: 11, rank: 1, title: "The Rise of Edge Computing: What Developers Need to Know", excerpt: "Edge computing is reshaping how we build and deploy applications for millions of users globally.", cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop", category: "Technology", badge: "🏆 Top Story", date: "May 8", readTime: 8, views: 6320, likes: 289, bookmarks: 98, author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" } },
            { id: 12, rank: 2, title: "Slow Travel: Why Less Is More When Exploring the World", excerpt: "Spending weeks in a destination transforms how you experience culture, food, and the people you meet.", cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=450&fit=crop", category: "Travel", badge: "💎 Popular", date: "Apr 28", readTime: 4, views: 1940, likes: 102, bookmarks: 33, author: { name: "Priya Nair", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" } },
            { id: 13, rank: 3, title: "A Beginner's Guide to Motion Design with Framer Motion", excerpt: "From zero to beautiful animations — a complete walkthrough of Motion React for React developers.", cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop", category: "Design", badge: "📈 Rising", date: "Jun 26", readTime: 8, views: 3400, likes: 201, bookmarks: 74, author: { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" } },
        ],
        list: [
            { id: 14, rank: 4, title: "Science of Sleep: What Research Says", category: "Health", author: "James Okafor", date: "Apr 18", readTime: 7, views: 5410, likes: 331, cover: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=160&h=160&fit=crop" },
            { id: 15, rank: 5, title: "The Psychology Behind Great Product Copy", category: "Design", author: "Priya Nair", date: "May 30", readTime: 7, views: 4210, likes: 198, cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=160&h=160&fit=crop" },
            { id: 16, rank: 6, title: "CSS Container Queries Are Here", category: "Technology", author: "Alex Morgan", date: "Apr 30", readTime: 6, views: 4220, likes: 218, cover: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=160&h=160&fit=crop" },
        ],
    },
    "This Month": {
        hero: [
            { id: 17, rank: 1, title: "Why TypeScript Is No Longer Optional for Serious Projects", excerpt: "How TypeScript's type system saves thousands of hours in debugging and makes large codebases manageable.", cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop", category: "Technology", badge: "🏆 Top Story", date: "Jun 18", readTime: 9, views: 11430, likes: 724, bookmarks: 215, author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" } },
            { id: 18, rank: 2, title: "Building with Vite in 2025: A Complete Setup Guide", excerpt: "Everything you need to set up a modern Vite project with React, Tailwind, and best-in-class tooling.", cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop", category: "Technology", badge: "🔥 Hot", date: "Jun 10", readTime: 11, views: 8940, likes: 519, bookmarks: 142, author: { name: "James Okafor", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" } },
            { id: 19, rank: 3, title: "A Practical Guide to Web Performance in 2025", excerpt: "Core Web Vitals, lazy loading, edge caching — what actually moves the needle on real-world scores.", cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop", category: "Technology", badge: "⭐ Editor's Pick", date: "May 22", readTime: 7, views: 5890, likes: 311, bookmarks: 104, author: { name: "Priya Nair", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" } },
        ],
        list: [
            { id: 20, rank: 4, title: "State Management in 2025", category: "Technology", author: "Tom Brennan", date: "Jun 25", readTime: 10, views: 7410, likes: 402, cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=160&h=160&fit=crop" },
            { id: 21, rank: 5, title: "Science of Sleep", category: "Health", author: "James Okafor", date: "Apr 18", readTime: 7, views: 5410, likes: 331, cover: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=160&h=160&fit=crop" },
            { id: 22, rank: 6, title: "Designing for Accessibility: Beyond the Basics", category: "Design", author: "Alex Morgan", date: "May 15", readTime: 6, views: 2870, likes: 177, cover: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=160&h=160&fit=crop" },
            { id: 23, rank: 7, title: "How Remote Work Changed Productivity", category: "Business", author: "Tom Brennan", date: "May 20", readTime: 5, views: 3100, likes: 145, cover: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=160&h=160&fit=crop" },
        ],
    },
};

const periods = ["Today", "This Week", "This Month"];




function Trending() {
    const [period, setPeriod] = useState("Today");
    const current = data[period];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50"
        >
            {/* ── Hero section ── */}
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-3 py-1.5 rounded-full mb-5">
                            <Flame size={11} />
                            Trending now
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-3">
                            What Everyone's Reading
                        </h1>
                        <p className="text-stone-400 text-sm sm:text-base max-w-md mx-auto">
                            Discover the stories readers are loving right now.
                        </p>
                    </motion.div>

                    {/* Period switcher — sticky */}
                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-t border-stone-100 -mx-4 sm:-mx-6 lg:-mx-10">
                        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                            <div className="flex items-center overflow-x-auto scrollbar-hide">
                                {periods.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`relative flex-shrink-0 px-5 sm:px-6 py-3.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${period === p ? "text-[#0077CC]" : "text-stone-500 hover:text-stone-800"
                                            }`}
                                    >
                                        {p}
                                        {period === p && (
                                            <motion.div
                                                layoutId="period-underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077CC] rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Body ── */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
                <div className="flex gap-8 xl:gap-12 items-start">

                    {/* Main feed */}
                    <div className="flex-1 min-w-0 space-y-8">

                        {/* Top 3 hero cards */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={period + "-hero"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="space-y-4 sm:space-y-5"
                            >
                                {current.hero.map((blog, i) => (
                                    <TrendingHeroCard key={blog.id} blog={blog} rank={blog.rank} delay={0.06 * i} />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-stone-200" />
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                                Leaderboard
                            </span>
                            <div className="flex-1 h-px bg-stone-200" />
                        </div>

                        {/* Leaderboard #4+ */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={period + "-list"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                            >
                                <TrendingLeaderboard blogs={current.list} />
                            </motion.div>
                        </AnimatePresence>

                        {/* Sidebar on tablet/mobile — renders below feed */}
                        <div className="lg:hidden">
                            <TrendingSidebar />
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45 }}
                            className="bg-[#0D1B2A] rounded-2xl px-6 sm:px-10 py-10 sm:py-12 text-center"
                        >
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                                Explore More Stories
                            </h2>
                            <p className="text-stone-400 text-sm max-w-sm mx-auto mb-7 leading-relaxed">
                                You've seen today's trending stories. Discover everything in our blog.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 bg-[#0077CC] hover:bg-[#005FA3] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                            >
                                View All Articles
                                <ArrowRight size={14} />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Sidebar — desktop only */}
                    <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-16">
                        <TrendingSidebar />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Trending

