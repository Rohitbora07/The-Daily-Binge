import { useEffect, useState, useRef } from "react";
import api from "../../api/axios"
import { ADMIN_ALL_USERS_ROUTE, ADMIN_DELETE_MULTIPLE_USERS_ROUTE } from "../../constants/route";
import { Trash2, CheckSquare, Square } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { AnimatePresence } from "motion/react"
import DeleteModal from "../../components/general/DeleteModal";
import BlogFilterBar from "./BlogManager/BlogFilterBar";
import UserCard from "./UserCard";
import useDebounce from "../../hooks/useDebounce";


export default function AdminAllUsers() {
    const [loading, setLoading] = useState(true)
    const [allUser, setAllUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [status, setStatus] = useState("all");
    const [selectedIds, setSelectedIds] = useState([]);
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [isEmailVerified, setIsEmailVerified] = useState("all");

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
        if (selectedIds.length === allUser.length && allUser.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allUser.map(b => b._id));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        const filterOutBulk = (list) => list.filter(b => !selectedIds.includes(b._id));
        try {
            setDeleteLoading(true)
            const { data } = await api.post(ADMIN_DELETE_MULTIPLE_USERS_ROUTE,
                { userIds: selectedIds }
            )
            setShowDeleteModal(false);
            console.log(data)
            setAllUsers(filterOutBulk);
            setSelectedIds([]);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
        } finally {
            setDeleteLoading(false)
        }

    };


    const sortOptions = [
        { title: "Sort by Latest", value: "latest" },
        { title: "Sort by Oldest", value: "oldest" },
        { title: "Sort by Views", value: "views" },
        { title: "Sort by Likes", value: "likes" },
        { title: "Sort by Blogs", value: "blogs" },
        { title: "Sort by Bookmarks", value: "bookmarks" },
        { title: "Sort by Comments", value: "comments" }
    ]

    const emailVerificationOptions = [
        { title: "All", value: "all" },
        { title: "Verified", value: "true" },
        { title: "Not Verified", value: "false" },
    ];

    const statusOptions = [
        { title: "All", value: "all" },
        { title: "Active", value: "active" },
        { title: "Blocked", value: "blocked" },
    ]

    useEffect(() => {
        const getAdminStats = async () => {
            try {
                setLoading(true)
                const { data } = await api.get(`${ADMIN_ALL_USERS_ROUTE}?page=${page}&limit=8&sort=${sortBy}&status=${status}&search=${searchTerm}&isEmailVerified=${isEmailVerified}`)
                setAllUsers(data.users || [])
                setTotalPages(data.totalPages)
                console.log(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAdminStats()
    }, [page, sortBy, status, debouncedSearch, isEmailVerified])

    // REMOVED: Full-screen early return loading check from here

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
                        isEmailVerified={isEmailVerified}
                        setIsEmailVerified={setIsEmailVerified}
                        emailVerificationOptions={emailVerificationOptions}
                        thirdFilter={true}
                    />

                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={handleSelectAll}
                            disabled={loading}
                            className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors select-none disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {selectedIds.length === allUser.length && allUser.length > 0 ? (
                                <CheckSquare size={15} className="text-[#0077CC]" />
                            ) : <Square size={15} />}
                            Select all matching ({allUser.length})
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
                    ) : allUser.length > 0 ? (
                        allUser.map((user, idx) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                index={idx}
                                isSelected={selectedIds.includes(user?._id)}
                                onSelect={() => handleSelectOne(user?._id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/50 shadow-sm text-xs font-medium text-stone-400">
                            No Users found.
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