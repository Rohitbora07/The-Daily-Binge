import { useState, useEffect, useRef } from "react";
import { Trash2, FilePlus, ArrowLeft, CheckSquare, Square, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import AdminBlogStripeItem from "../AdminBlogStripeItem";
import SearchBar from "../../../components/SearchBar";
import api from "../../../api/axios";
import { GET_ALL_BLOGS, ADMIN_DELETE_MULTIPLE_BLOGS } from "../../../constants/route";
import Pagination from "../../../components/Pagination";
import { AnimatePresence } from "motion/react"
import DeleteModal from "../../../components/general/DeleteModal";


export default function LatestBlogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [period, setPeriod] = useState("Today");

    const [latestBlogs, setlatestBlogs] = useState([]);
    const [yesterdayBlogs, setyesterdayBlogs] = useState([]);
    const [weekBlogs, setweekBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [yesterdayPage, setYesterdayPage] = useState(1)
    const [totalYesterdayPages, setTotalYesterdayPages] = useState(1)
    const [weeklyPage, setweeklyPage] = useState(1)
    const [totalWeeklyPage, setTotalWeeklyPage] = useState(1)

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const contentRef = useRef(null)


    useEffect(() => {
        const getTrendingBlogs = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`${GET_ALL_BLOGS}?range=24h&page=${page}&limit=10`);
                const { data: yesterdayData } = await api.get(`${GET_ALL_BLOGS}?range=yesterday&page=${yesterdayPage}&limit=10`);
                const { data: weekData } = await api.get(`${GET_ALL_BLOGS}?range=week&page=${weeklyPage}&limit=10`);
                setlatestBlogs(data.blogs || []);
                setyesterdayBlogs(yesterdayData.blogs || []);
                setweekBlogs(weekData.blogs || []);

                setTotalPages(data.totalPages)
                setTotalYesterdayPages(yesterdayData.totalPages)
                setTotalWeeklyPage(weekData.totalPages)
            } catch (error) {
                console.error("Failed to load trending blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        getTrendingBlogs();
    }, [page, yesterdayPage, weeklyPage]);

    const rawActiveBlogs = period === "Today" ? latestBlogs : period === "This Week" ? weekBlogs : yesterdayBlogs
    const currentPage = period === "Today" ? page : period === "Yesterday" ? yesterdayPage : weeklyPage
    const currentTotalPages = period === "Today" ? totalPages : period === "Yesterday" ? totalYesterdayPages : totalWeeklyPage


    const filteredBlogs = (rawActiveBlogs || []).filter(b => {
        if (!b) return false;
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = b.title?.toLowerCase().includes(searchLower);
        const authorMatch = b.author?.name?.toLowerCase().includes(searchLower) ||
            b.author?.toLowerCase?.().includes(searchLower);
        return titleMatch || authorMatch;
    });

    const handlePageChange = (newPage) => {
        if (period === "Today") setPage(newPage)
        else if (period === "Yesterday") setYesterdayPage(newPage)
        else setweeklyPage(newPage)
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Handle tab switching
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        setSelectedIds([]); // Clear selection when changing tabs
    };
    const handleSelectAll = () => {
        if (selectedIds.length === filteredBlogs.length && filteredBlogs.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredBlogs.map(b => b._id));
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
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setDeleteLoading(false)
        }
        setlatestBlogs(filterOutBulk);
        setyesterdayBlogs(filterOutBulk);
        setweekBlogs(filterOutBulk);
        setSelectedIds([]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50/60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-[#0077CC]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50/60 font-sans antialiased text-stone-800">
            {/* Contextual Header */}
            <header className="bg-white border-b border-stone-100 sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link to="/admin" className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors">
                            <ArrowLeft size={16} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Flame size={16} className="text-amber-500 fill-amber-500" />
                            <h1 className="text-sm font-semibold text-stone-800">Trending Analytics</h1>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#0077CC] hover:bg-[#005FA3] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                        <FilePlus size={14} /> New Post
                    </button>
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">

                {/* Range Tab Switcher UI */}
                <div className="flex justify-center sm:justify-start">
                    <div className="bg-stone-200/60 p-1 rounded-xl flex gap-1 items-center">
                        {["Today", "Yesterday", "This Week"].map((t) => (
                            <button
                                key={t}
                                onClick={() => handlePeriodChange(t)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${period === t
                                    ? "bg-white text-stone-900 shadow-sm font-semibold"
                                    : "text-stone-500 hover:text-stone-800"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Bulk Action Workspace */}
                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />

                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors select-none"
                        >
                            {selectedIds.length === filteredBlogs.length && filteredBlogs.length > 0 ? (
                                <CheckSquare size={15} className="text-[#0077CC]" />
                            ) : <Square size={15} />}
                            Select all matching ({filteredBlogs.length})
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

                {/* Stripe Item Render Loop */}
                <div className="space-y-3">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog, idx) => (
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
                                ? "No trending articles match your search."
                                : `No trending articles found for ${period}.`}
                        </div>
                    )}
                </div>
                <Pagination currentPage={currentPage}
                    totalPages={currentTotalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal setShowDeleteModal={setShowDeleteModal} handleDelete={handleBulkDelete} deleteLoading={deleteLoading} />
                )}
            </AnimatePresence>
        </div>
    );
}