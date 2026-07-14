import { motion, AnimatePresence } from "motion/react";
import { Flame, Search, TrendingUp } from "lucide-react";
import FeaturedBlog from "../../components/FeaturedBlog"
import TrendingSidebar from "../../components/trending/TrendingSidebar";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { TRENDING_BLOGS } from "../../constants/route";
import BlogStripeList from "../../components/BlogStripeList";
import BlogSidebar from "../../components/blog/BlogSidebar";
import Pagination from "../../components/Pagination"
import FilterBar from "../../components/general/FilterBar";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../components/SearchBar";


function Trending() {

    const [trendingBlogs, setTrendingBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [period, setPeriod] = useState("24h");
    const [sortBy, setSortBy] = useState("trending");

    const sortOptions = [
        { title: "Sort by Latest", value: "latest" },
        { title: "Sort by Oldest", value: "oldest" },
        { title: "Sort by Views", value: "views" },
        { title: "Sort by Likes", value: "likes" },
        { title: "Sort by Trending", value: "trending" },
        { title: "Sort by Bookmarks", value: "bookmarks" },
        { title: "Sort by Comments", value: "comments" }
    ];

    const timePeriod = [
        { title: "Today", value: "24h" },
        { title: "This Week", value: "week" },
        { title: "This Month", value: "month" },
    ];

    const contentRef = useRef(null);

    useEffect(() => {
        const getAll = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`${TRENDING_BLOGS}?range=${period}&page=${page}&limit=10&sort=${sortBy}&search=${debouncedSearch}`);
                setTrendingBlogs(data.blogs || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAll();
    }, [page, period, sortBy, debouncedSearch]);


    const tags = trendingBlogs ? [...new Set(trendingBlogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const trendingAuthors = trendingBlogs ? [...new Map(trendingBlogs.map(blog => [blog?.author?._id, blog?.author])).values()].filter(Boolean) : [];

    const categoryMap = new Map();
    if (trendingBlogs) {
        for (const item of trendingBlogs) {
            const categ = item.category;
            if (categ) categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1);
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };




    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50 mt-20"
        >
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
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

                    <div className="flex-1 w-full min-w-0 space-y-6 sm:space-y-8">

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={period + "-hero"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="space-y-4 sm:space-y-5"
                            >
                                {trendingBlogs.length > 0 && (
                                    <FeaturedBlog
                                        blog={trendingBlogs[0]}
                                        title="Trending Now"
                                        Icon={TrendingUp}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="space-y-4">
                            <SearchBar value={searchTerm} setVal={setSearchTerm} />
                            <FilterBar
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                sortOptions={sortOptions}
                                status={period}
                                setStatus={setPeriod}
                                statusOptions={timePeriod}
                            />
                        </div>

                        <div className="w-full">
                            {loading ? (
                                <div className="w-full flex items-center justify-center py-24 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
                                </div>
                            ) : trendingBlogs.length > 0 ? (
                                <div className="space-y-6">
                                    <span className="text-lg font-bold flex items-center text-stone-800">Leaderboard</span>
                                    <BlogStripeList blogs={trendingBlogs.slice(1)} />
                                </div>
                            ) : (
                                <div className="w-full text-center py-16 sm:py-24 px-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm flex flex-col items-center justify-center">
                                    <div className="text-stone-300 mb-3">
                                        <Search size={22} />
                                    </div>
                                    <h3 className="text-stone-800 font-medium text-base mb-1">No Articles Found</h3>
                                    <p className="text-stone-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                                        {searchTerm
                                            ? `No latest articles match "${searchTerm}". Try tweaking your keywords.`
                                            : `We couldn't find any articles published within this time frame (${period}).`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!loading && trendingBlogs.length > 0 && (
                            <div className="pt-4 border-t border-stone-100">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}

                    </div>

                    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24">
                        <BlogSidebar tags={tags} categoryMap={categoryMap} authors={trendingAuthors} title="Trending" />
                    </div>

                </div>
            </div>
        </motion.div>
    );
}

export default Trending

