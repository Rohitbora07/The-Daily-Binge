import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, TrendingUp, Sparkles, Clock10Icon, Users } from "lucide-react";
import BlogCardFeatured from "../components/blog/BlogCardFeatured";
import BlogSidebar from "../components/blog/BlogSidebar";
import { GET_ALL_BLOGS, TRENDING_BLOGS, FEATURED_BLOGS, ALL_USERS_ROUTE } from "../constants/route";
import api from "../api/axios";
import TitleBar from "../components/TitleBar";
import BlogGrid from "../components/BlogGrid";
import UserGrid from "../components/UserGrid";


export default function BlogListing() {

    const [blogs, setBlogs] = useState(null)
    const [todayTrendingBlogs, setTodayTrendingBlogs] = useState(null)
    const [latestBlogs, setLatestBlogs] = useState(null)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState(null)


    // const navigate = useNavigate()

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(FEATURED_BLOGS)
                const { data: trend } = await api.get(`${TRENDING_BLOGS}?range=24h`)
                const { data: latest } = await api.get(`${GET_ALL_BLOGS}?range=24h`)
                const { data: users } = await api.get(`${ALL_USERS_ROUTE}?limit=3`)
                setLatestBlogs(latest.blogs)
                setTodayTrendingBlogs(trend.blogs)
                setUsers(users.users)
                console.log("data", data)
                setBlogs(data.blogs)
            } catch (error) {
                console.log(error)
            }
        }
        getAll()
    }, [])






    const tags = blogs ? [...new Set(blogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const authors = blogs ? [...new Map(blogs.map(blog => [blog.author._id,blog.author])).values()] : []
    const categoryMap = new Map()
    if (blogs) {
        for (const item of blogs) {
            const categ = item.category;
            categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1)
        }
    }



    console.log(tags)

    if (!blogs) {
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
            className="min-h-screen bg-stone-50 mt-20"
        >
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                            Explore ideas worth
                            <br />
                            <span className="text-[#0077CC]">reading.</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
                {blogs && (
                    <div className="mb-8 md:mb-12">
                        <BlogCardFeatured blog={blogs[0]} />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
                    <div className="w-full flex-1 min-w-0 order-1">
                        <TitleBar Icon={Clock10Icon} title="Latest Articles" destination={`/explore/latest`} />
                        <AnimatePresence mode="wait">
                            {latestBlogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={latestBlogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>

                        <TitleBar Icon={TrendingUp} title="Trending Articles" destination={`/explore/trending`} />
                        <AnimatePresence mode="wait">
                            {todayTrendingBlogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={todayTrendingBlogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>

                        <TitleBar Icon={Sparkles} title="Editor's Pick" destination={`/explore/editor-pick`} />
                        <AnimatePresence mode="wait">
                            {blogs.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                </motion.div>
                            ) : (
                                <BlogGrid blogs={blogs} sliceLimit={3} />
                            )}
                        </AnimatePresence>

                        <TitleBar Icon={Users} title="All Authors" destination={`/explore/authors`} />
                        <AnimatePresence mode="wait">
                            {users?.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                        <Search size={22} className="text-stone-300" />
                                    </div>
                                    <h3 className="text-stone-700 font-semibold mb-1">
                                        No articles found
                                    </h3>
                                </motion.div>
                            ) : (
                                <UserGrid users={users} sliceLimit={3} />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-full lg:w-auto order-2 lg:order-2">
                        <BlogSidebar tags={tags} categoryMap={categoryMap} authors={authors} title="Explore" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}