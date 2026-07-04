import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, TrendingUp, Clock, Sparkles } from "lucide-react";
import BlogCard from "../components/blog/BlogCard";
// import BlogCardFeatured from "../components/blog/BlogCardFeatured";
import BlogSidebar from "../components/blog/BlogSidebar";
// import NewsletterSection from "../components/blog/NewsletterSection";
import BlogPagination from "../components/blog/BlogPagination";
import { GET_ALL_BLOGS } from "../constants/route";
import api from "../api/axios";


// const categories = [
//     "All", "Technology", "Design", "Business",
//     "Science", "Culture", "Health", "Travel",
// ];


const ITEMS_PER_PAGE = 6;
const feedTabs = [
    { key: "latest", label: "Latest", icon: Clock },
    { key: "trending", label: "Trending", icon: TrendingUp },
    { key: "picks", label: "Editor's picks", icon: Sparkles },
];

export default function BlogListing() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeFeed, setActiveFeed] = useState("latest");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState(null)

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(GET_ALL_BLOGS)
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

    const totalPages = blogs && Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const paginated = blogs && seachedBlogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleCategory = (cat) => { setActiveCategory(cat); setPage(1); };
    const handleSearch = (val) => { setSearch(val); setPage(1); };

    const categories = blogs && ["All", ...new Set(blogs.map(blog => blog.category))]
    const tags = blogs && [...new Set(blogs.map(blog => blog.tags).flat())].slice(0, 20);
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
            className="min-h-screen bg-stone-50"
        >
            {/* Hero */}
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-3 py-1.5 rounded-full mb-5">
                            <Sparkles size={12} />
                            Editorial · Ideas · Stories
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-5">
                            Explore ideas worth
                            <br />
                            <span className="text-[#0077CC]">reading.</span>
                        </h1>
                        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                            Thoughtful writing on design, technology, culture, and the ideas
                            shaping the world we live in.
                        </p>

                        {/* Search bar */}
                        <div className="relative max-w-lg mx-auto">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search articles, topics, authors…"
                                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-stone-200 bg-white shadow-sm text-stone-700 placeholder:text-stone-400 text-sm focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10">

                {/* Featured post
                {featured && !search && activeCategory === "All" && (
                    <div className="mb-10">
                        <BlogCardFeatured blog={featured} />
                    </div>
                )} */}

                {/* Category pills */}
                {
                    !search && <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleCategory(cat)}
                                className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${activeCategory === cat
                                    ? "bg-[#0077CC] text-white border-[#0077CC] shadow-sm"
                                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                }


                {/* Feed + sidebar */}
                <div className="flex gap-8 xl:gap-12 items-start">

                    {/* Main feed */}
                    <div className="flex-1 min-w-0">

                        {/* Feed tabs */}
                        {
                            !search &&
                            <div className="flex items-center gap-1 border-b border-stone-200 mb-7">
                                {feedTabs.map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveFeed(key)}
                                        className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeFeed === key
                                            ? "text-[#0077CC]"
                                            : "text-stone-500 hover:text-stone-800"
                                            }`}
                                    >
                                        <Icon size={13} />
                                        {label}
                                        {activeFeed === key && (
                                            <motion.div
                                                layoutId="feed-underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077CC] rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        }


                        {/* Grid */}
                        <AnimatePresence mode="wait">
                            {paginated.length === 0 ? (
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
                                            ? `Nothing matches "${search}". Try different keywords.`
                                            : `No articles in ${activeCategory} yet.`}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`${activeFeed}-${activeCategory}-${page}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                                >
                                    {paginated.map((blog, i) => (
                                        <BlogCard key={blog._id} blog={blog} delay={0.05 * i} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <BlogPagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}

                        {/* <div className="mt-14">
                            <NewsletterSection />
                        </div> */}
                    </div>

                    {/* Sidebar */}
                    <BlogSidebar tags={tags} categoryMap={categoryMap} />
                </div>
            </div>
        </motion.div>
    );
}