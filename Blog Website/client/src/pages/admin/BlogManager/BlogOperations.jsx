import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_PUBLISH_BLOG_ROUTE, ADMIN_UNPUBLISH_BLOG_ROUTE, FEATURE_BLOG_ROUTE, GET_SINGLE_BLOG, ADMIN_DELETE_ONE_BLOG, ADMIN_TOGGLE_COMMENT_ROUTE } from "../../../constants/route"

import {ArrowLeft,Trash2,Star,Eye,Heart,MessageSquare,Bookmark,ExternalLink,AlertTriangle,CheckCircle2, CircleDashed,Tag} from "lucide-react";


export default function AdminBlogDetails() {

    const [blog, setBlog] = useState([])
    const [currentStatus, setCurrentStatus] = useState();
    const [isFeatured, setIsFeatured] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [author, setAuthor] = useState([])
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [totalBookmarks, setTotalBookmarks] = useState(0);


    const navigate = useNavigate()


    const { slug } = useParams();

    const handleStatusChange = async (newStatus) => {
        if (!blog?._id) return;
        const route = newStatus === "published" ? ADMIN_PUBLISH_BLOG_ROUTE(blog?._id) : ADMIN_UNPUBLISH_BLOG_ROUTE(blog?._id);

        try {
            const { data } = await api.patch(route)
            console.log(data)
            setCurrentStatus(data.blog.status)
        } catch (error) {
            console.log(error.response.data.message)
        }
    };

    useEffect(() => {
        const getSingleBlog = async () => {
            try {
                const { data } = await api.get(GET_SINGLE_BLOG(slug))
                console.log(data)
                setBlog(data.blog || [])
                setCurrentStatus(data.blog.status)
                setIsFeatured(data.blog.isFeatured)
                setAllowComments(data.blog.allowComments)
                setAuthor(data.blog.author || [])
                setTotalBookmarks(data.totalBookmarks)
            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        getSingleBlog()
    }, [slug])

    const handleToggleFeatured = async () => {
        if (!blog?._id) return;
        try {
            const { data } = await api.patch(FEATURE_BLOG_ROUTE(blog?._id))
            setIsFeatured(data.isFeatured)
            console.log(data)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            const { data } = await api.delete(ADMIN_DELETE_ONE_BLOG(blog?._id))
            console.log(data)
            setShowDeleteModal(false)
            navigate("/admin/blogs/latest")
        } catch (error) {
            console.log(error.response.data.message)
        }finally {
            setDeleteLoading(false)
        }
    }

    const handleToggleComments = async () => {
        try {
            const { data } = await api.patch(ADMIN_TOGGLE_COMMENT_ROUTE(blog?._id))
            console.log(data)
            setAllowComments(data.allowComments)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    if (blog.length === 0) {
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
            className="min-h-screen bg-stone-50 pb-12"
        >
            <header className="bg-white border-b border-stone-100 sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
                    <button
                        className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to all posts
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                            ID: {blog.id}
                        </span>
                        <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                        >
                            <span>Live Preview</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#E0F0FF] flex items-center justify-center flex-shrink-0 text-[#0077CC]">
                            <Eye size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Total Views</p>
                            <p className="text-lg font-semibold text-stone-800">{blog.views}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-600">
                            <Heart size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Likes</p>
                            <p className="text-lg font-semibold text-stone-800">{blog.likes}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Comments</p>
                            <p className="text-lg font-semibold text-stone-800">{blog.commentsCount}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                        className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 flex items-center gap-3.5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                            <Bookmark size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-400 font-medium">Bookmarks</p>
                            <p className="text-lg font-semibold text-stone-800">{totalBookmarks}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.25 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-6"
                        >
                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> {currentStatus}
                                    </span>
                                    {isFeatured && (
                                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                            <Star size={12} className="fill-amber-500 text-amber-500" /> Featured
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-stone-400">
                                    {/* Published: {new Date(blog.publishedAt)} */}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-stone-800 leading-snug">
                                    {blog.title}
                                </h1>
                                <p className="text-sm text-stone-500 mt-2 font-mono bg-stone-50 p-2 rounded-lg border border-stone-100 inline-block">
                                    /{blog.slug}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                                    Summary / Excerpt
                                </h3>
                                <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    {blog.excerpt || "No excerpt available."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
                                    Tags & Categorization
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {blog.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600"
                                        >
                                            <Tag size={11} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.25 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 space-y-5"
                        >
                            <h2 className="text-sm font-semibold text-stone-800 border-b border-stone-100 pb-3">
                                Admin Controls
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                                        Post Status
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {["published", "draft"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(status)}
                                                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${currentStatus === status
                                                    ? "bg-[#0077CC] text-white border-[#0077CC] shadow-sm"
                                                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-stone-800">Featured Article</p>
                                            <p className="text-[11px] text-stone-400">Pin to top of blog index</p>
                                        </div>
                                        <button
                                            onClick={handleToggleFeatured}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${isFeatured ? "bg-[#0077CC]" : "bg-stone-300"
                                                }`}
                                        >
                                            <motion.div
                                                layout
                                                className="bg-white w-4 h-4 rounded-full shadow-md"
                                                animate={{ x: isFeatured ? 20 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-stone-800">Allow Comments</p>
                                            <p className="text-[11px] text-stone-400">Enable public discussion</p>
                                        </div>
                                        <button
                                            onClick={handleToggleComments}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${allowComments ? "bg-[#0077CC]" : "bg-stone-300"
                                                }`}
                                        >
                                            <motion.div
                                                layout
                                                className="bg-white w-4 h-4 rounded-full shadow-md"
                                                animate={{ x: allowComments ? 20 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 pt-4">
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Delete this post
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.3 }}
                            className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 space-y-4"
                        >
                            <h2 className="text-sm font-semibold text-stone-800 border-b border-stone-100 pb-3">
                                Author Details
                            </h2>
                            <div className="flex items-center gap-3.5">
                                <img
                                    src={author.profileImg}
                                    alt={author.name}
                                    className="w-12 h-12 rounded-full object-cover border border-stone-200 flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-stone-800 truncate">
                                        {author.name}
                                    </p>
                                    <p className="text-xs text-stone-400 truncate">{author.email}</p>
                                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                                        {author.role}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex justify-between text-xs">
                                <span className="text-stone-500 font-medium">Total Author Posts</span>
                                {/* <span className="font-semibold text-stone-800">{author.postsCount}</span> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-sm w-full relative z-10 space-y-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-stone-800">Delete blog post?</h3>
                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                    Are you sure you want to delete <span className="font-semibold text-stone-700">"{blog.title}"</span>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm"
                                >
                                    {deleteLoading ? <CircleDashed size={20} className="animate-spin" /> : "Yes, Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}