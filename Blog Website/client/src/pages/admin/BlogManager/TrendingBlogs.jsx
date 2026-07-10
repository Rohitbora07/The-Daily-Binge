import { useState, useEffect } from "react";
import { Trash2, FilePlus, ArrowLeft, CheckSquare, Square, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import AdminBlogStripeItem from "../AdminBlogStripeItem";
import SearchBar from "../../../components/SearchBar";
import api from "../../../api/axios";
import { TRENDING_BLOGS } from "../../../constants/route";

export default function TrendingBlogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [period, setPeriod] = useState("Today");

    const [todayTrendingBlogs, setTodayTrendingBlogs] = useState([]);
    const [weeklyTrendingBlogs, setWeeklyTrendingBlogs] = useState([]);
    const [monthlyTrendingBlogs, setMonthlyTrendingBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTrendingBlogs = async () => {
            setLoading(true);
            try {
                const [dayRes, weekRes, monthRes] = await Promise.all([
                    api.get(`${TRENDING_BLOGS}?range=24h`),
                    api.get(`${TRENDING_BLOGS}?range=week`),
                    api.get(`${TRENDING_BLOGS}?range=month`)
                ]);
                
                setTodayTrendingBlogs(dayRes.data?.blogs || []);
                setWeeklyTrendingBlogs(weekRes.data?.blogs || []);
                setMonthlyTrendingBlogs(monthRes.data?.blogs || []);
            } catch (error) {
                console.error("Failed to load trending blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        getTrendingBlogs();
    }, []);

    // 1. Determine which list we are currently looking at based on the active tab
    const rawActiveBlogs = 
        period === "Today" ? todayTrendingBlogs : 
        period === "This Week" ? weeklyTrendingBlogs : 
        monthlyTrendingBlogs;

    // 2. Apply search text filtering to that specific list
    const filteredBlogs = (rawActiveBlogs || []).filter(b => {
        if (!b) return false;
        const searchLower = searchTerm.toLowerCase();
        // Adjust these fields based on your actual API response structure
        const titleMatch = b.title?.toLowerCase().includes(searchLower);
        const authorMatch = b.author?.name?.toLowerCase().includes(searchLower) || 
                            b.author?.toLowerCase?.().includes(searchLower);
        return titleMatch || authorMatch;
    });

    // Handle tab switching
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        setSelectedIds([]); // Clear selection when changing tabs
    };

    // Selection Handlers (Now tied to filteredBlogs so hidden items aren't selected)
    const handleSelectAll = () => {
        if (selectedIds.length === filteredBlogs.length && filteredBlogs.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredBlogs.map(b => b.id));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // Deletion Actions
    const handleDelete = (id) => {
        if (confirm("Permanently remove this blog from trending?")) {
            const filterOut = (list) => list.filter(b => b.id !== id);
            setTodayTrendingBlogs(filterOut);
            setWeeklyTrendingBlogs(filterOut);
            setMonthlyTrendingBlogs(filterOut);
            setSelectedIds(prev => prev.filter(item => item !== id));
            // Add your API delete call here later
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to remove the ${selectedIds.length} selected items?`)) {
            const filterOutBulk = (list) => list.filter(b => !selectedIds.includes(b.id));
            setTodayTrendingBlogs(filterOutBulk);
            setWeeklyTrendingBlogs(filterOutBulk);
            setMonthlyTrendingBlogs(filterOutBulk);
            setSelectedIds([]);
            // Add your API bulk delete call here later
        }
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
                        {["Today", "This Week", "This Month"].map((t) => (
                            <button
                                key={t}
                                onClick={() => handlePeriodChange(t)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    period === t 
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
                                onClick={handleBulkDelete}
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
                                key={blog.id || idx}
                                blog={blog}
                                index={idx}
                                isSelected={selectedIds.includes(blog.id)}
                                onSelect={() => handleSelectOne(blog.id)}
                                onDelete={() => handleDelete(blog.id)}
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
            </div>
        </div>
    );
}