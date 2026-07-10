import { motion } from "motion/react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
// import ProfileBlogGrid from "../components/profile/ProfileBlogGrid";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
// import  userAuthStore  from "../store/authStore";
import { USER_DETAIL_ROUTE } from "../constants/route";
import BlogGrid from "../components/BlogGrid";

export default function UserProfile() {

    const { userId } = useParams()
    const [blogs, setBlogs] = useState(null)
    // const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)


    useEffect(() => {
        const getUserBlogs = async () => {
            try {
                // setLoading(true);
                const { data } = await api.get(USER_DETAIL_ROUTE(userId));
                // console.log(data)    
                setBlogs(data.blogs);
                setCurrentUser(data.user)
            } catch (error) {
                console.error("Error fetching user blogs:", error);
            }
        };
        if (userId) getUserBlogs();
    }, [userId, currentUser]);

    if (!currentUser || !blogs) {
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

            {/* Body: blog grid + sidebar */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
                <div className="flex gap-8 xl:gap-12 items-start">
                    {/* Blog grid */}
                    <BlogGrid blogs={blogs} />

                    {/* Sidebar */}
                    <ProfileSidebar blogs={blogs} />
                </div>
            </div>
        </motion.div>
    );
}