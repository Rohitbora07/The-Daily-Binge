import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ALL_USERS_ROUTE } from "../../constants/route";
import api from "../../api/axios";
import Pagination from "../../components/common/Pagination"
import FilterBar from "../../components/common/FilterBar";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../components/common/SearchBar";
import UserGrid from "../../components/user/UserGrid";
import { Search } from "lucide-react"

function Users() {

    const [users, setusers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [sortBy, setSortBy] = useState("totalBlogs");

    const sortOptions = [
        { title: "Sort by Latest", value: "latest" },
        { title: "Sort by Oldest", value: "oldest" },
        { title: "Sort by Views", value: "totalViews" },
        { title: "Sort by Likes", value: "totalLikes" },
        { title: "Sort by Blogs", value: "totalBlogs" },
        { title: "Sort by Bookmarks", value: "totalBookmarks" },
        { title: "Sort by Comments", value: "comments" }
    ];


    const contentRef = useRef(null);

    useEffect(() => {
        const getAll = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`${ALL_USERS_ROUTE}?page=${page}&limit=6&sort=${sortBy}&search=${debouncedSearch}`);
                setusers(data.users || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAll();
    }, [page, sortBy, debouncedSearch]);



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
                        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-3">Explore Authors</h1>
                        <p className="text-stone-500 text-sm sm:text-base max-w-lg">Discover and connect with our community of writers and readers.</p>
                    </div>
                </div>
            </section>

            {/* Main Content Container - Wrap this in matching container classes */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-10 items-start w-full">

                    {/* Left Side: Search, Filters, and Blog List */}
                    <div className="flex-1 w-full min-w-0 space-y-8">
                        <div className="space-y-4">
                            <SearchBar value={searchTerm} setVal={setSearchTerm} />
                            <FilterBar
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                sortOptions={sortOptions}
                                secondFilter={false}
                                thirdFilter={false}
                            />
                        </div>

                        <div className="w-full">
                            {loading ? (
                                <div className="w-full flex items-center justify-center py-24 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
                                </div>
                            ) : users.length > 0 ? (
                                <UserGrid users={users} />
                            ) : (
                                <div className="w-full text-center py-16 sm:py-24 px-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm flex flex-col items-center justify-center">
                                    <div className="text-stone-300 mb-3">
                                        <Search size={30} />

                                    </div>
                                    <h3 className="text-stone-800 font-medium text-base mb-1">No Users Found</h3>
                                    <p className="text-stone-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                                        {searchTerm
                                            ? `No latest users match "${searchTerm}". Try tweaking your keywords.`
                                            : `We couldn't find any users matching your criteria.`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!loading && users.length > 0 && (
                            <div className="pt-6 border-t border-stone-100">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </motion.div>
    )
}

export default Users