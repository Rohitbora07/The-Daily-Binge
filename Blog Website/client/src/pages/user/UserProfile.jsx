import { motion, AnimatePresence } from "motion/react";
import ProfileHeader from "../../components/user/profile/ProfileHeader";
import ProfileStats from "../../components/user/profile/ProfileStats";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Pagination from "../../components/common/Pagination";
import api from "../../api/axios";
import { USER_DETAIL_ROUTE, DELETE_BLOG } from "../../constants/route";
import BlogGrid from "../../components/blog/BlogGrid";
import FilterBar from "../../components/common/FilterBar";
import SearchBar from "../../components/common/SearchBar";
import DeleteModal from "../../components/common/DeleteModal";
import userAuthStore from "../../store/authStore";
import useDebounce from "../../hooks/useDebounce";

export default function UserProfile() {
    const { userId } = useParams();
    const [blogs, setBlogs] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const user = userAuthStore((state) => state.user);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const contentRef = useRef(null);
    let isEditable = user && user._id === userId;
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const sortOptions = [
        { title: "Sort by Latest", value: "latest" },
        { title: "Sort by Oldest", value: "oldest" },
        { title: "Sort by Views", value: "views" },
        { title: "Sort by Likes", value: "likes" },
        { title: "Sort by Trending", value: "trending" },
        { title: "Sort by Bookmarks", value: "bookmarks" },
        { title: "Sort by Comments", value: "comments" }
    ];

    const statusOptions = [
        { title: "All", value: "all" },
        { title: "Published", value: "published" },
        { title: "Draft", value: "draft" },
    ];

    const timePeriod = [
        { title: "Today", value: "24h" },
        { title: "Yesterday", value: "yesterday" },
        { title: "This Week", value: "week" },
        { title: "This Month", value: "month" },
        { title: "This Year", value: "year" }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [status, setStatus] = useState("all");
    const [period, setPeriod] = useState("24h");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [selectedSlug, setSelectedSlug] = useState(null);

    const [userLoading, setUserLoading] = useState(true);
    const [blogsLoading, setBlogsLoading] = useState(true);

    const handleDelete = async (slug) => {
        setDeleteLoading(true);
        try {
            await api.post(DELETE_BLOG(slug));
            setBlogs((prev) =>
                prev.filter((blog) => blog.slug !== slug)
            );

            setShowDeleteModal(false);

        } catch (error) {
            console.log(error?.response?.data?.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            if (!userId) return;
            try {
                setUserLoading(true);
                const { data } = await api.get(`${USER_DETAIL_ROUTE(userId)}?page=1&limit=1`);
                setCurrentUser(data.user);
            } catch (error) {
                console.error("Error fetching profile profile data:", error?.response?.data?.message);
            } finally {
                setUserLoading(false);
            }
        };
        getUserData();
    }, [userId]);

    useEffect(() => {
        const getUserBlogs = async () => {
            if (!userId) return;
            try {
                setBlogsLoading(true);
                const { data } = await api.get(`${USER_DETAIL_ROUTE(userId)}?page=${page}&limit=10&search=${debouncedSearch}&sort=${sortBy}&status=${status}&period=${period}`);
                setBlogs(data.blogs);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching user blogs:", error?.response?.data?.message);
            } finally {
                setBlogsLoading(false);
            }
        };
        getUserBlogs();
    }, [userId, page, debouncedSearch, sortBy, status, period]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50"
        >
            <div className="bg-white border-b border-stone-100 pb-0">
                {!userLoading && <ProfileHeader user={currentUser} isEditable={isEditable} />}
            </div>

            <div className="bg-white border-b border-stone-100">
                {!userLoading && <ProfileStats user={currentUser} />}
            </div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />

                    {isEditable === true ? (
                        <FilterBar
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOptions={sortOptions}
                            status={period}
                            setStatus={setPeriod}
                            statusOptions={timePeriod}
                            thirdFilter={true}
                            isEmailVerified={status}
                            setIsEmailVerified={setStatus}
                            emailVerificationOptions={statusOptions}
                        />
                    ) : (
                        <FilterBar
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOptions={sortOptions}
                            status={status}
                            setStatus={setStatus}
                            statusOptions={statusOptions}
                        />
                    )}
                </div>

                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
                    <div className="flex gap-8 xl:gap-12 items-start">
                        <div className="flex flex-col w-full">
                            {blogsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0077CC]"></div>
                                </div>
                            ) : !blogs || blogs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-stone-200 rounded-2xl bg-white text-center">
                                    <p className="text-sm font-medium text-stone-500">No blogs found matching the criteria.</p>
                                </div>
                            ) : (
                                <>
                                    <BlogGrid blogs={blogs} isEditable={isEditable} setShowDeleteModal={setShowDeleteModal} setSelectedSlug={setSelectedSlug} />
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal setShowDeleteModal={setShowDeleteModal} handleDelete={() => handleDelete(selectedSlug)} deleteLoading={deleteLoading} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}