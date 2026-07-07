import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import FreshSidebar from "../../components/latest/FreshSidebar";
import { BlogCard } from "../../components/BlogCard"
import { GET_ALL_BLOGS } from "../../constants/route";
import api from "../../api/axios";
import BlogGrid from "../../components/BlogGrid";


/* Simple helper to calculate stats based on currently selected flat list of blogs */
function getStats(blogs) {
    const total = blogs.length;
    const authors = [...new Set(blogs.map(b => b.author.name))].length;
    const catCount = {};
    const tagCount = {};

    blogs.forEach(b => {
        catCount[b.category] = (catCount[b.category] || 0) + 1;
        b.tags?.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
    });

    const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const avgRead = total ? Math.round(blogs.reduce((s, b) => s + b.readTime, 0) / total) : 0;
    const categories = Object.entries(catCount).map(([name, count]) => ({ name, count }));
    const tags = Object.keys(tagCount).slice(0, 10);

    return { total, authors, topCat, avgRead: `${avgRead} min avg`, categories, tags };
}

const PAGE_SIZE = 6;

export default function Latest() {
    const [period, setPeriod] = useState("Today");
    const [activeCat, setActiveCat] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [showTop, setShowTop] = useState(false);
    // const [blogs, setBlogs] = useState(null)
    const [last24hrBlogs, setLast24hrBlogs] = useState(null)
    const [lastWeekBlogs, setLastWeekBlogs] = useState(null)
    const [lastMonthBlogs, setLastMonthBlogs] = useState(null)

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(`${GET_ALL_BLOGS}?range=24hr`)
                console.log("data", data)
                setLast24hrBlogs(data.blogs || [])
                const { data: weekData } = await api.get(`${GET_ALL_BLOGS}?range=week`)
                setLastWeekBlogs(weekData.blogs || [])
                const { data: monthData } = await api.get(`${GET_ALL_BLOGS}?range=month`)
                setLastMonthBlogs(monthData.blogs || [])
            } catch (error) {
                console.log(error)
            }
        }
        getAll()
    }, [])

    // 1. Simple Flat Filter Logic
    const filteredBlogs = last24hrBlogs && lastWeekBlogs && lastMonthBlogs ? ( period === "Today" ? last24hrBlogs : period === "This Week" ? lastWeekBlogs : lastMonthBlogs) : []

    const displayedBlogs = filteredBlogs.slice(0, visible);
    const stats = getStats(filteredBlogs);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const switchPeriod = (p) => {
        setPeriod(p);
        setActiveCat(null);
        setActiveTag(null);
        setVisible(PAGE_SIZE);
    };

    if (  !last24hrBlogs || !lastWeekBlogs || !lastMonthBlogs) {
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
                        <div className="text-xs text-stone-400 font-semibold">{stats.total} fresh stories</div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-t border-stone-100 -mx-4 px-4 flex gap-6 overflow-x-auto">
                        {["Today", "This Week", "This Month"].map(p => (
                            <button
                                key={p}
                                onClick={() => switchPeriod(p)}
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

                    {/* Flat Blog Layout Replacement */}
                    {displayedBlogs.length > 0 ? (
                        <BlogGrid blogs={displayedBlogs} sliceLimit={displayedBlogs.length} />
                    ) : (
                        <div className="text-center py-12 text-stone-400">No stories found matching the active criteria.</div>
                    )}

                    {/* Load More Trigger */}
                    {filteredBlogs.length > visible && (
                        <button onClick={() => setVisible(v => v + PAGE_SIZE)} className="mt-8 mx-auto block px-6 py-2 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-100 text-sm font-medium transition-colors">
                            Load More
                        </button>
                    )}
                </div>

                {/* Sidebar Sticky Wrapper */}
                <div className="w-full lg:w-72 xl:w-80 lg:sticky lg:top-16">
                    <FreshSidebar
                        categories={stats.categories}
                        tags={stats.tags}
                        stats={stats}
                        activeCat={activeCat}
                        activeTag={activeTag}
                        onCatClick={setActiveCat}
                        onTagClick={setActiveTag}
                    />
                </div>
            </div>

            {/* Back to Top Feature */}
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