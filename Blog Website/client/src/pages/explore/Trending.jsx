import { motion, AnimatePresence } from "motion/react";
import { Flame, ArrowRight } from "lucide-react";
import FeaturedBlog from "../../components/FeaturedBlog"
import TrendingSidebar from "../../components/trending/TrendingSidebar";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { TRENDING_BLOGS } from "../../constants/route";
import BlogStripeList from "../../components/BlogStripeList";
import BlogSidebar from "../../components/blog/BlogSidebar";


const periods = ["Today", "This Week", "This Month"];




function Trending() {
    const [period, setPeriod] = useState("Today");

    const [todayTrendingBlogs, setTodayTrendingBlogs] = useState(null)
    const [weeklyTrendingBlogs, setWeeklyTrendingBlogs] = useState(null)
    const [monthlyTrendingBlogs, setMonthlyTrendingBlogs] = useState(null)
    const [loading, setLoading] = useState(true)

    const currentBlogs = period === "Today" ? todayTrendingBlogs : period === "This Week" ? weeklyTrendingBlogs : monthlyTrendingBlogs

    useEffect(() => {
        const getTredingBlogs = async () => {
            setLoading(true)
            try {

                const { data } = await api.get(`${TRENDING_BLOGS}?range=24h`)
                const { data: weeklyData } = await api.get(`${TRENDING_BLOGS}?range=week`)
                const { data: monthlyData } = await api.get(`${TRENDING_BLOGS}?range=month`)
                // console.log("daily:", data.blogs)
                setTodayTrendingBlogs(data.blogs)
                setWeeklyTrendingBlogs(weeklyData.blogs)
                setMonthlyTrendingBlogs(monthlyData.blogs)
                // console.log("Weekly:", weeklyData.blogs)
                // console.log("Monthly:", monthlyData.blogs)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getTredingBlogs()
    }, [])

    const tags = currentBlogs ? [...new Set(currentBlogs.map(blog => blog.tags).flat())].slice(0, 20) : []
    const trendingAuthors = currentBlogs ? [... new Map(currentBlogs.map(blog => [blog.author._id, blog.author])).values()] : []

    const categoryMap = new Map()
    if (currentBlogs) {
        for (const item of currentBlogs) {
            const categ = item.category;
            categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }

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
                                {currentBlogs.length > 0 && (
                                    <FeaturedBlog
                                        blog={currentBlogs[0]}
                                        title="Most Popular"
                                    />
                                )}
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
                                <BlogStripeList blogs={currentBlogs} />
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

                    <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-16">
                        <BlogSidebar tags={tags} categoryMap={categoryMap} authors={trendingAuthors} title="Trending" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Trending

