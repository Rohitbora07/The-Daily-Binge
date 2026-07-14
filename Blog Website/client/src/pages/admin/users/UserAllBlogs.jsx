import { useEffect, useState, useRef } from "react";
import api from "../../../api/axios"
import { ADMIN_GET_USER_BLOGS_ROUTE, ADMIN_DELETE_MULTIPLE_BLOGS } from "../../../constants/route";
import { Trash2, CheckSquare, Square } from "lucide-react";
import AdminBlogStripeItem from "../../../components/admin/blogs/AdminBlogStripeItem";
import SearchBar from "../../../components/common/SearchBar";
import Pagination from "../../../components/common/Pagination";
import { AnimatePresence } from "motion/react"
import DeleteModal from "../../../components/common/DeleteModal";
import BlogFilterBar from "../../../components/common/FilterBar";
import { useParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

function UserAllBlogs() {

    const {userId} = useParams()

    const [loading, setLoading] = useState(true)
    const [allBlogs, setAllBlogs] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [status, setStatus] = useState("all");
    const [selectedIds, setSelectedIds] = useState([]);
    const setDebouncedSearch = useDebounce(searchTerm, 500);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const contentRef = useRef(null)

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const handleSelectAll = () => {
        if (selectedIds.length === allBlogs.length && allBlogs.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allBlogs.map(b => b._id));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        const filterOutBulk = (list) => list.filter(b => !selectedIds.includes(b._id));
        try {
            setDeleteLoading(true)
            const { data } = await api.post(ADMIN_DELETE_MULTIPLE_BLOGS,
                { blogIds: selectedIds }
            )
            setShowDeleteModal(false);
            console.log(data)
            setAllBlogs(filterOutBulk);
            setSelectedIds([]);
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setDeleteLoading(false)
        }

    };


    const sortOptions = [
        { title: "Sort by Latest", value: "latest" },
        { title: "Sort by Oldest", value: "oldest" },
        { title: "Sort by Views", value: "views" },
        { title: "Sort by Likes", value: "likes" },
        { title: "Sort by Trending", value: "trending" },
        { title: "Sort by Bookmarks", value: "bookmarks" },
        { title: "Sort by Comments", value: "comments" }
    ]

    const statusOptions = [
        { title: "All", value: "all" },
        { title: "Published", value: "published" },
        { title: "Draft", value: "draft" },
    ]

    useEffect(() => {
        const getAdminStats = async () => {
            try {
                setLoading(true)
                const { data } = await api.get(`${ADMIN_GET_USER_BLOGS_ROUTE(userId)}?page=${page}&limit=8&sort=${sortBy}&status=${status}&search=${searchTerm}`)
                setAllBlogs(data.blogs || [])
                setTotalPages(data.totalPages)
                console.log(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAdminStats()
    }, [page, sortBy, status, setDebouncedSearch, userId])

    return (
        <div className="min-h-screen bg-stone-50/60 font-sans antialiased text-stone-800 mt-20" ref={contentRef}>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">

                {/* Search & Tool Workspace controls row */}
                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />

                    <BlogFilterBar
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOptions={sortOptions}
                        status={status}
                        setStatus={setStatus}
                        statusOptions={statusOptions}
                    />

                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={handleSelectAll}
                            disabled={loading}
                            className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors select-none disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {selectedIds.length === allBlogs.length && allBlogs.length > 0 ? (
                                <CheckSquare size={15} className="text-[#0077CC]" />
                            ) : <Square size={15} />}
                            Select all matching ({allBlogs.length})
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
                    ) : allBlogs.length > 0 ? (
                        allBlogs.map((blog, idx) => (
                            <AdminBlogStripeItem
                                key={blog._id}
                                blog={blog}
                                index={idx}
                                isSelected={selectedIds.includes(blog?._id)}
                                onSelect={() => handleSelectOne(blog?._id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/50 shadow-sm text-xs font-medium text-stone-400">
                            No articles found matching your parameters.
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

export default UserAllBlogs
