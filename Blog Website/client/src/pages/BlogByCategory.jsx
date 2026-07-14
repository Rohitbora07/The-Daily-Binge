import { useEffect, useState, useRef } from "react"
import api from "../api/axios"
import { BLOGS_BY_CATEGORY } from "../constants/route"
import { useParams } from "react-router-dom"
import BlogGrid from "../components/BlogGrid"
import { StarsIcon, ChevronDown } from "lucide-react";
import SearchBar from "../components/SearchBar"
import { motion } from "motion/react"
import BlogSidebar from "../components/blog/BlogSidebar"
import useDebounce from "../hooks/useDebounce"
import Pagination from "../components/Pagination"
import FilterBar from "../components/general/FilterBar"
import { Search } from "lucide-react"


function BlogByCategory() {

    const { category } = useParams()
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1)


    const [blogs, setBlogs] = useState(null)
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
                const { data } = await api.get(`${BLOGS_BY_CATEGORY(category)}?range=${period}&page=${page}&limit=10&sort=${sortBy}&search=${debouncedSearch}`);
                setBlogs(data.blogs || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAll();
    }, [page, period, sortBy, debouncedSearch]);


    const tags = blogs ? [...new Set(blogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const latestAuthors = blogs ? [...new Map(blogs.map(blog => [blog?.author?._id, blog?.author])).values()].filter(Boolean) : [];

    const categoryMap = new Map();
    if (blogs) {
        for (const item of blogs) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50">
                        <StarsIcon size={13} className="text-[#0077CC]" />
                    </div>
                    <h2 className="text-xl font-serif font-medium tracking-tight text-stone-900">{capitalized}</h2>
                </div>
            </div>

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
                        ) : blogs.length > 0 ? (
                            <BlogGrid blogs={blogs} />
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

                    {!loading && blogs.length > 0 && (
                        <div className="pt-6 border-t border-stone-100">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24">
                    <BlogSidebar
                        tags={tags}
                        categoryMap={categoryMap}
                        authors={latestAuthors}
                        title="Latest"
                    />
                </div>
            </div>
        </div>
    )
}

export default BlogByCategory
