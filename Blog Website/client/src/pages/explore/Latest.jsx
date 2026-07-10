import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { GET_ALL_BLOGS } from "../../constants/route";
import api from "../../api/axios";
import BlogGrid from "../../components/BlogGrid";
import BlogSidebar from "../../components/blog/BlogSidebar";



export default function Latest() {
    const [period, setPeriod] = useState("Today");
    const [activeCat, setActiveCat] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [showTop, setShowTop] = useState(false);
    const [last24hrBlogs, setLast24hrBlogs] = useState(null)
    const [lastWeekBlogs, setLastWeekBlogs] = useState(null)
    const [lastMonthBlogs, setLastMonthBlogs] = useState(null)

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(`${GET_ALL_BLOGS}?range=24h`)
                console.log("Today's data", data)
                setLast24hrBlogs(data.blogs || [])
                const { data: weekData } = await api.get(`${GET_ALL_BLOGS}?range=yesterday`)
                console.log("Yesterday's data", weekData)
                setLastWeekBlogs(weekData.blogs || [])
                const { data: monthData } = await api.get(`${GET_ALL_BLOGS}?range=week`)
                console.log("This week's data", monthData)
                setLastMonthBlogs(monthData.blogs || [])
            } catch (error) {
                console.log(error)
            }
        }
        getAll()
    }, [])

    const currentBlogs = period === "Today" ? last24hrBlogs : period === "Yesterday" ? lastWeekBlogs : lastMonthBlogs

    const tags = currentBlogs ? [...new Set(currentBlogs.map(blog => blog.tags).flat())].slice(0, 20) : []
    const latestAuthors = currentBlogs ? [... new Map(currentBlogs.map(blog => [blog.author._id, blog.author])).values()] : []

    const categoryMap = new Map()
    if (currentBlogs) {
        for (const item of currentBlogs) {
            const categ = item.category;
            categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1)
        }
    }



    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);



    if (!last24hrBlogs || !lastWeekBlogs || !lastMonthBlogs) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-stone-50">
            {/* Hero / Header */}
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 pt-12 pb-0">
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live feed
                        </span>
                        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-3">Fresh Stories</h1>
                        <p className="text-stone-400 text-sm max-w-lg mb-4">Stay updated with our latest releases.</p>
                        {/* <div className="text-xs text-stone-400 font-semibold">{stats.total} fresh stories</div> */}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-t border-stone-100 -mx-4 px-4 flex gap-6 overflow-x-auto">
                        {["Today", "Yesterday", "This Week"].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`relative py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${period === p ? "text-[#0077CC]" : "text-stone-500 hover:text-stone-800"}`}
                            >
                                {p}
                                {period === p && <motion.div layoutId="fresh-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077CC]" />}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Body */}
            <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">

                {/* Blog Grid Column */}
                <div className="flex-1 min-w-0 w-full">

                    {/* Active Filter Indicators */}
                    <AnimatePresence>
                        {(activeCat || activeTag) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mb-5 flex-wrap">
                                {activeCat && <button onClick={() => setActiveCat(null)} className="text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-3 py-1 rounded-lg">{activeCat} ×</button>}
                                {activeTag && <button onClick={() => setActiveTag(null)} className="text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-3 py-1 rounded-lg">#{activeTag} ×</button>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentBlogs.length > 0 ? (
                        <BlogGrid blogs={currentBlogs} sliceLimit={currentBlogs.length} />
                    ) : (
                        <div className="text-center py-12 text-stone-400">No stories found matching the active criteria.</div>
                    )}

                </div>

                <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-16">
                    <BlogSidebar tags={tags} categoryMap={categoryMap} authors={latestAuthors} title="Latest" />
                </div>
            </div>

            <AnimatePresence>
                {showTop && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-stone-200 shadow-md rounded-xl flex items-center justify-center text-stone-500 hover:text-[#0077CC] z-50">
                        <ArrowUp size={16} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}