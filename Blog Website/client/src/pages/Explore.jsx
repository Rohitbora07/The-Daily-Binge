import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, TrendingUp, Sparkles, Globe, ChevronDown } from "lucide-react";
import BlogCardFeatured from "../components/blog/BlogCardFeatured";
import BlogSidebar from "../components/blog/BlogSidebar";
import { GET_ALL_BLOGS, TRENDING_BLOGS } from "../constants/route";
import api from "../api/axios";
import SearchBar from "../components/SearchBar"
// import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import BlogGrid from "../components/BlogGrid";



const sortOptions = ["Newest first", "Oldest first", "Most viewed", "Most liked"];


export default function BlogListing() {
    // const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState(null)
    const [todayTrendingBlogs, setTodayTrendingBlogs] = useState(null)
    const [latestBlogs, setLatestBlogs] = useState(null)

    const [sort, setSort] = useState("Sort by");
    const [sortOpen, setSortOpen] = useState(false)

    // const navigate = useNavigate()

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(GET_ALL_BLOGS)
                const { data: trend } = await api.get(`${TRENDING_BLOGS}?range=24h`)
                const { data: latest } = await api.get(`${GET_ALL_BLOGS}?range=24h`)
                setLatestBlogs(latest.blogs)
                setTodayTrendingBlogs(trend.blogs)
                console.log("data", data)
                setBlogs(data.blogs)
            } catch (error) {
                console.log(error)
            }
        }
        getAll()
    }, [])




    const seachedBlogs = blogs && blogs.filter(blogs =>
        blogs.title.toLowerCase().includes(search.toLowerCase()) ||
        blogs.category.toLowerCase().includes(search.toLowerCase()) ||
        blogs.author.name.toLowerCase().includes(search.toLowerCase())
    )

    const tags = blogs ? [...new Set(blogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const authors = blogs ? [...new Map(blogs.map(blog => [blog.author._id,blog.author])).values()] : []
    const categoryMap = new Map()
    if (blogs) {
        for (const item of blogs) {
            const categ = item.category;
            categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1)
        }
    }



    console.log(tags)

    if (!blogs) {
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
            className="min-h-screen bg-stone-50 mt-12"
        >
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:pt-20 md:pb-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-7">
                            Explore ideas worth
                            <br />
                            <span className="text-[#0077CC]">reading.</span>
                        </h1>
                        <div className=" flex sm:flex-row flex-col justify-between" >
                            <SearchBar value={search} setVal={setSearch} />
                            <div className=" ml-20">
                                <button
                                    onClick={() => setSortOpen(p => !p)}
                                    className="flex items-center w-48 justify-center py-3.5 gap-2 px-4 rounded-2xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 shadow-sm focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all"
                                >
                                    {sort}
                                    <ChevronDown
                                        size={13}
                                        className={`text-stone-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {
                                    sortOpen &&
                                    <motion.ul
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute z-20  mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden"
                                    >
                                        {sortOptions.map((s) => (
                                            <li key={s}>
                                                <button
                                                    onClick={() => { setSort(s); setSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-stone-50 ${sort === s
                                                        ? "text-[#0077CC] font-medium bg-[#E0F0FF]"
                                                        : "text-stone-700"
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                }

                            </div>
                        </div>

                    </motion.div>
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-0">

                {blogs && !search && (
                    <div className="mb-10">
                        <BlogCardFeatured blog={blogs[0]} />
                    </div>
                )}


                <div className="flex gap-8 xl:gap-12 items-start">

                    <div className="flex-1 min-w-0">

                        {!search && <TitleBar Icon={Globe} title="Latest Articles" destination={`/explore/latest`} />}
                        <AnimatePresence mode="wait">
                            {latestBlogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                    <p className="text-sm text-stone-400 max-w-xs">
                                        {search
                                            && `Nothing matches "${search}". Try different keywords.`}
                                    </p>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={latestBlogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>

                        {!search && <TitleBar Icon={TrendingUp} title="Trending Articles" destination={`/explore/trending`} />}

                        <AnimatePresence mode="wait">
                            {todayTrendingBlogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                    <p className="text-sm text-stone-400 max-w-xs">
                                        {search
                                            && `Nothing matches "${search}". Try different keywords.`}
                                    </p>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={todayTrendingBlogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>

                        {!search && <TitleBar Icon={Sparkles} title="Editor's Pick" destination={`/explore/editor-pick`} />}

                        <AnimatePresence mode="wait">
                            {seachedBlogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                    <p className="text-sm text-stone-400 max-w-xs">
                                        {search
                                            && `Nothing matches "${search}". Try different keywords.`}
                                    </p>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={seachedBlogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>
                    </div>

                    <BlogSidebar tags={tags} categoryMap={categoryMap} authors={authors} title="Explore" />
                </div>
            </div>
        </motion.div>
    );
}