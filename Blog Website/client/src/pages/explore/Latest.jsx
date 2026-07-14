import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { GET_ALL_BLOGS } from "../../constants/route";
import api from "../../api/axios";
import BlogGrid from "../../components/blog/BlogGrid";
import BlogSidebar from "../../components/blog/BlogSidebar";
import Pagination from "../../components/common/Pagination"
import FilterBar from "../../components/common/FilterBar";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../components/common/SearchBar";
import { Clock10Icon, Search } from "lucide-react";

export default function Latest() {
    const [latestBlogs, setlatestBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [period, setPeriod] = useState("24h");
    const [sortBy, setSortBy] = useState("latest");

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
        { title: "Yesterday", value: "yesterday" },
        { title: "This Week", value: "week" },
    ];

    const contentRef = useRef(null);

    useEffect(() => {
        const getAll = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`${GET_ALL_BLOGS}?range=${period}&page=${page}&limit=10&sort=${sortBy}&search=${debouncedSearch}`);
                setlatestBlogs(data.blogs || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAll();
    }, [page, period, sortBy, debouncedSearch]);


    const tags = latestBlogs ? [...new Set(latestBlogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const latestAuthors = latestBlogs ? [...new Map(latestBlogs.map(blog => [blog?.author?._id, blog?.author])).values()].filter(Boolean) : [];

    const categoryMap = new Map();
    if (latestBlogs) {
        for (const item of latestBlogs) {
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
    <motion.div ref={contentRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-stone-50 mt-20">

        <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077CC] bg-[#E0F0FF] px-3 py-1.5 rounded-full mb-5">
                            <Clock10Icon size={11} />
                            Recently Published
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-3">
                            Read the latest articles from our community.
                        </h1>
                        <p className="text-stone-400 text-sm sm:text-base max-w-md mx-auto">
                            Stay updated with our latest releases.
                        </p>
                    </motion.div>
                </div>
            </section>


        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
                

                <div className="flex-1 w-full min-w-0 space-y-8">
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
                        ) : latestBlogs.length > 0 ? (
                            <BlogGrid blogs={latestBlogs} />
                        ) : (
                            <div className="w-full text-center py-16 sm:py-24 px-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm flex flex-col items-center justify-center">
                                <div className="text-stone-300 mb-3">
                                    <Search size={30} />
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

                    {!loading && latestBlogs.length > 0 && (
                        <div className="pt-6 border-t border-stone-100">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-8">
                    <BlogSidebar
                        tags={tags}
                        categoryMap={categoryMap}
                        authors={latestAuthors}
                        title="Latest"
                    />
                </div>
                
            </div>
        </div>
    </motion.div>
);
}