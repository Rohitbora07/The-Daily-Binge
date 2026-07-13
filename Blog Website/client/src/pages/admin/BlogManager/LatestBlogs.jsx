import { useState, useEffect, useRef } from "react";
import { Trash2, CheckSquare, Square } from "lucide-react";
import AdminBlogStripeItem from "../AdminBlogStripeItem";
import SearchBar from "../../../components/SearchBar";
import api from "../../../api/axios";
import { ADMIN_RECENT_BLOGS_ROUTE, ADMIN_DELETE_MULTIPLE_BLOGS } from "../../../constants/route";
import Pagination from "../../../components/Pagination";
import { AnimatePresence } from "motion/react";
import DeleteModal from "../../../components/general/DeleteModal";
import BlogFilterBar from "./BlogFilterBar";
import useDebounce from "../../../hooks/useDebounce";

export default function LatestBlogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [selectedIds, setSelectedIds] = useState([]);
    const [period, setPeriod] = useState("24h");
    const [sortBy, setSortBy] = useState("latest");

    const [latestBlogs, setlatestBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const contentRef = useRef(null);

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

    useEffect(() => {
        const getTrendingBlogs = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`${ADMIN_RECENT_BLOGS_ROUTE}?range=${period}&page=${page}&limit=10&sort=${sortBy}&search=${searchTerm}`);
                setlatestBlogs(data.blogs || []);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Failed to load trending blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        getTrendingBlogs();
    }, [page, period, sortBy, debouncedSearch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === latestBlogs.length && latestBlogs.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(latestBlogs.map(b => b._id));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        const filterOutBulk = (list) => list.filter(b => !selectedIds.includes(b._id));
        try {
            setDeleteLoading(true);
            const { data } = await api.post(ADMIN_DELETE_MULTIPLE_BLOGS, { blogIds: selectedIds });
            setShowDeleteModal(false);
            console.log(data);
        } catch (error) {
            console.log(error.response.data.message);
        } finally {
            setDeleteLoading(false);
        }
        setlatestBlogs(filterOutBulk);
        setSelectedIds([]);
    };


    return (
        <div className="min-h-screen bg-stone-50/60 font-sans antialiased text-stone-800 mt-20" ref={contentRef}>


            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />

                    <BlogFilterBar
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOptions={sortOptions}
                        status={period}
                        setStatus={setPeriod}
                        statusOptions={timePeriod}
                    />

                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={handleSelectAll}
                            disabled={loading}
                            className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors select-none disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {selectedIds.length === latestBlogs.length && latestBlogs.length > 0 ? (
                                <CheckSquare size={15} className="text-[#0077CC]" />
                            ) : <Square size={15} />}
                            Select all matching ({latestBlogs.length})
                        </button>

                        {selectedIds.length > 0 && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-xl border border-red-200/40 transition-colors"
                            >
                                <Trash2 size={13} /> Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-stone-200/50 shadow-sm">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-[#0077CC]"></div>
                        </div>
                    ) : latestBlogs.length > 0 ? (
                        latestBlogs.map((blog, idx) => (
                            <AdminBlogStripeItem
                                key={blog._id || idx}
                                blog={blog}
                                index={idx}
                                isSelected={selectedIds.includes(blog._id)}
                                onSelect={() => handleSelectOne(blog._id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/50 shadow-sm text-xs font-medium text-stone-400">
                            {searchTerm
                                ? "No latest articles match your search."
                                : `No latest articles found for ${period}.`}
                        </div>
                    )}
                </div>

                {!loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal setShowDeleteModal={setShowDeleteModal} handleDelete={handleBulkDelete} deleteLoading={deleteLoading} />
                )}
            </AnimatePresence>
        </div>
    );
}