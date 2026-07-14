import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FEATURED_BLOGS } from "../../constants/route";
import api from "../../api/axios";
import BlogGrid from "../../components/BlogGrid";
import BlogSidebar from "../../components/blog/BlogSidebar";
import Pagination from "../../components/Pagination"
import FilterBar from "../../components/general/FilterBar";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../components/SearchBar";



function EditorPick() {
    const [featuredBlogs, setfeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [period, setPeriod] = useState("week");
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
        { title: "This Week", value: "week" },
        { title: "This Month", value: "month" },
        { title: "This Year", value: "year" }
    ];

    const contentRef = useRef(null);

    useEffect(() => {
        const getAll = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`${FEATURED_BLOGS}?range=${period}&page=${page}&limit=10&sort=${sortBy}&search=${debouncedSearch}`);
                setfeaturedBlogs(data.blogs || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAll();
    }, [page, period, sortBy, debouncedSearch]);


    const tags = featuredBlogs ? [...new Set(featuredBlogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const featuredAuthors = featuredBlogs ? [...new Map(featuredBlogs.map(blog => [blog?.author?._id, blog?.author])).values()].filter(Boolean) : [];

    const categoryMap = new Map();
    if (featuredBlogs) {
        for (const item of featuredBlogs) {
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
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-12 sm:pb-8 text-center flex flex-col items-center justify-center">
                    <div className="mb-4">
                        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-3">Editor's Pick</h1>
                        <p className="text-stone-500 text-sm sm:text-base max-w-lg">Curated selection of the best content from our community.</p>
                    </div>
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
                            ) : featuredBlogs.length > 0 ? (
                                <BlogGrid blogs={featuredBlogs} />
                            ) : (
                                <div className="w-full text-center py-16 sm:py-24 px-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm flex flex-col items-center justify-center">
                                    <div className="text-stone-300 mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    </div>
                                    <h3 className="text-stone-800 font-medium text-base mb-1">No Articles Found</h3>
                                    <p className="text-stone-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                                        {searchTerm
                                            ? `No featured articles match "${searchTerm}". Try tweaking your keywords.`
                                            : `We couldn't find any featured articles published within this time frame (${period}).`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!loading && featuredBlogs.length > 0 && (
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
                            authors={featuredAuthors}
                            title="Most Shined"
                        />
                    </div>

                </div>
            </div>
        </motion.div>
    )
}

export default EditorPick
