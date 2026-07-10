import { useState } from "react";
import { Trash2, FilePlus, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Link } from "react-router-dom";
import AdminBlogStripeItem from "./AdminBlogStripeItem";
import SearchBar from "../../components/SearchBar";

const dummyBlogs = [
    { id: 1, slug: "typescript-not-optional", title: "Why TypeScript Is No Longer Optional", category: "Development", author: "Sarah Chen", views: "1.4K", likes: 215, readTime: 6, status: "Published", isFeatured: true },
    { id: 2, slug: "building-vite-2025", title: "Building with Vite in 2025", category: "Tools", author: "James Okafor", views: 920, likes: 88, readTime: 4, status: "Published", isFeatured: false },
    { id: 3, slug: "motion-design-guide", title: "A Beginner's Guide to Motion Design", category: "Design", author: "Alex Morgan", views: 0, likes: 0, readTime: 7, status: "Pending", isFeatured: false },
    { id: 4, slug: "state-management-2025", title: "State Management in 2025", category: "Architecture", author: "Tom Brennan", views: 12, likes: 2, readTime: 5, status: "Draft", isFeatured: false },
];

export default function AdminBlogManager() {
    const [blogs, setBlogs] = useState(dummyBlogs);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // Selection Handlers
    const handleSelectAll = () => {
        if (selectedIds.length === filteredBlogs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredBlogs.map(b => b.id));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // Item Action Triggers
    const handleDelete = (id) => {
        if (confirm("Permanently delete this blog article?")) {
            setBlogs(prev => prev.filter(b => b.id !== id));
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleToggleStatus = (id) => {
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "Published" ? "Draft" : "Published" } : b));
    };

    const handleToggleFeatured = (id) => {
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, isFeatured: !b.isFeatured } : b));
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete the ${selectedIds.length} selected items?`)) {
            setBlogs(prev => prev.filter(b => !selectedIds.includes(b.id)));
            setSelectedIds([]);
        }
    };

    // Filtering Pipeline
    const filteredBlogs = blogs.filter(b => {
        return b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-stone-50/60 font-sans antialiased text-stone-800">
            {/* Header sticky block */}
            <header className="bg-white border-b border-stone-100 sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link to="/admin" className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors">
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-sm font-semibold text-stone-800">Manage Posts</h1>
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#0077CC] hover:bg-[#005FA3] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                        <FilePlus size={14} /> New Post
                    </button>
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
                
                {/* Search & Tool Workspace controls row */}
                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />
                    
                    {/* Bulk Management Status bar underneath input safely */}
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

                {/* Main Render Loop Container */}
                <div className="space-y-3">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog, idx) => (
                            <AdminBlogStripeItem 
                                key={blog.id}
                                blog={blog}
                                index={idx}
                                isSelected={selectedIds.includes(blog.id)}
                                onSelect={() => handleSelectOne(blog.id)}
                                onDelete={() => handleDelete(blog.id)}
                                onToggleStatus={() => handleToggleStatus(blog.id)}
                                onToggleFeatured={() => handleToggleFeatured(blog.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/50 shadow-sm text-xs font-medium text-stone-400">
                            No articles found matching your parameters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}