import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Bookmark } from "lucide-react";
import api from "../../api/axios";
import { BLOG_BOOKMARK, LIKE_BLOG, CHECK_USER_BLOG_BOOKMARK, CREATE_BOOKMARK, DELETE_BOOKMARK } from "../../constants/route";
import { useEffect } from "react";

export default function BlogShareBar({ blog, liked, setLiked }) {
    const [likes, setLikes] = useState(blog.likes);
    const [bookmarks, setBookmarks] = useState(blog.bookmarks);
    const [bookmarked, setBookmarked] = useState(false)

    const handleLike = async () => {
        try {
            console.log(blog)
            console.log(blog?._id)
            const { data } = await api.post(LIKE_BLOG(blog?._id))
            setLiked(data.isLiked)
            setLikes(data.likes)
            console.log(data)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        const getBookmarks = async () => {
            const { data } = await api.get(BLOG_BOOKMARK(blog?._id))
            const { data: check } = await api.get(CHECK_USER_BLOG_BOOKMARK(blog?._id))
            setBookmarked(check.isBookmarked)
            console.log(check.isBookmarked)
            console.log(data)
        }
        getBookmarks()
    }, [blog?._id])

    const handleBookmark = async () => {
        try {
            await api.post(CREATE_BOOKMARK(blog?._id))
            setBookmarked(true);
            setBookmarks(prev => prev + 1);
        } catch (error) {
            console.log(error)
        }
    }
    const handleRemoveBookmark = async () => {
    try {
        await api.delete(DELETE_BOOKMARK(blog?._id))
        setBookmarked(false);
        setBookmarks(prev => prev - 1);
    } catch (error) {
        console.log(error)
    }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-row lg:flex-col items-center gap-3 items-center justify-center lg:justify-start w-full lg:w-auto   "
        >
            <div className="flex flex-col items-center gap-1">
                <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${liked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white border-stone-200 text-stone-400 hover:border-red-200 hover:text-red-400"
                        }`}
                >
                    <Heart size={17} fill={liked ? "currentColor" : "none"} />
                </motion.button>
                <span className="text-[10px] font-medium text-stone-400">{likes}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={bookmarked ? handleRemoveBookmark : handleBookmark}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${bookmarked
                        ? "bg-[#E0F0FF] border-[#C8D8E8] text-[#0077CC]"
                        : "bg-white border-stone-200 text-stone-400 hover:border-[#C8D8E8] hover:text-[#0077CC]"
                        }`}
                >
                    <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
                </motion.button>
                <span className="text-[10px] font-medium text-stone-400">{bookmarks}</span>
            </div>


        </motion.div>
    );
}