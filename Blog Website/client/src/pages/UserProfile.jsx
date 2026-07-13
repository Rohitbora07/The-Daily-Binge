import { motion, AnimatePresence } from "motion/react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import api from "../api/axios";
import { USER_DETAIL_ROUTE, DELETE_BLOG } from "../constants/route";
import BlogGrid from "../components/BlogGrid";
import { useRef } from "react";
import FilterBar from "../components/general/FilterBar";
import SearchBar from "../components/SearchBar";
import DeleteModal from "../components/general/DeleteModal";

export default function UserProfile() {

    const { userId } = useParams()
    const [blogs, setBlogs] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);

    const contentRef = useRef(null);
    let isEditable = false
    blogs ? isEditable = userId === blogs[0].author?._id : isEditable = false

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
    ]

    const statusOptions = [
        { title: "All", value: "all" },
        { title: "Published", value: "published" },
        { title: "Draft", value: "draft" },
    ]

    const timePeriod = [
        { title: "Today", value: "24h" },
        { title: "This Week", value: "week" },
        { title: "This Month", value: "month" }
    ]

    // const debouncedSearch = useDebounce(searchTerm, 500);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("24h");

    const handleDelete = async (slug) => {
        setDeleteLoading(true);
        try {
            const { data } = await api.patch(DELETE_BLOG(slug))
            console.log(data)
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            setDeleteLoading(false);
        }
    };


    useEffect(() => {
        const getUserBlogs = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`${USER_DETAIL_ROUTE(userId)}?page=${page}&limit=10`);
                console.log(data)
                setBlogs(data.blogs);
                setCurrentUser(data.user)
                setTotalPages(data.totalPages)
            } catch (error) {
                console.error("Error fetching user blogs:", error.response.data.message);
            } finally {
                setLoading(false);
            }
        };
        if (userId) getUserBlogs();
    }, [userId, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50"
        >
            {/* Header: cover + avatar + name + bio + socials */}
            <div className="bg-white border-b border-stone-100 pb-0">
                <ProfileHeader user={currentUser} />
            </div>

            {/* Stats bar */}
            <div className="bg-white border-b border-stone-100">
                <ProfileStats user={currentUser} />
            </div>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">

                <div className="space-y-3">
                    <SearchBar value={searchTerm} setVal={setSearchTerm} />

                    {
                        isEditable === true ?
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
                            :
                            <FilterBar
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                sortOptions={sortOptions}
                                status={status}
                                setStatus={setStatus}
                                statusOptions={statusOptions}
                            />
                    }




                </div>

                {/* Body: blog grid + sidebar */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
                    <div className="flex  gap-8 xl:gap-12 items-start">
                        {/* Blog grid */}

                        <div className=" flex flex-col" >
                            <BlogGrid blogs={blogs} />

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>




                        {/* Sidebar */}
                        <ProfileSidebar blogs={blogs} />
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal setShowDeleteModal={setShowDeleteModal} handleDelete={handleDelete} deleteLoading={deleteLoading} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}