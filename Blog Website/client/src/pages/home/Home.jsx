import Hero from '../../components/home/Hero'
import Sidebar from '../../components/home/Sidebar'
import FeaturedBlog from '../../components/common/FeaturedBlog'
import BlogGrid from '../../components/blog/BlogGrid'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { GET_ALL_BLOGS, FEATURED_BLOGS, TRENDING_BLOGS } from '../.././constants/route'
import { Clock10Icon, ArrowRight, Star, TrendingUp } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import TitleBar from '../../components/common/TitleBar'

function Home() {
    const [blogs, setBlogs] = useState([])
    const [featuredBlogs, setFeaturedBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [trendingBlogs, setTrendingBlogs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getAll = async () => {
            try {
                setLoading(true)
                const { data } = await api.get(GET_ALL_BLOGS)
                const { data: featuredData } = await api.get(`${FEATURED_BLOGS}?limit=1`)
                const { data: trendingData } = await api.get(`${TRENDING_BLOGS}?limit=3`)
                setFeaturedBlogs(featuredData.blogs)
                setTrendingBlogs(trendingData.blogs)
                setBlogs(data.blogs)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getAll()
    }, [])

    const tags = blogs ? [...new Set(blogs.map(blog => blog.tags).flat())].slice(0, 20) : [];
    const categoryMap = new Map();
    if (blogs) {
        for (const item of blogs) {
            const categ = item.category;
            if (categ) categoryMap.set(categ, (categoryMap.get(categ) || 0) + 1);
        }
    }
    const featuredAuthors = blogs ? [...new Map(blogs.map(blog => [blog?.author?._id, blog?.author])).values()].filter(Boolean) : [];

    const sortedCategories = [...categoryMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, count]) => ({ name, count }));

    return (
        <div className="min-h-screen bg-[#F4F7FB] font-sans antialiased text-stone-900">
            <main>
                <Hero blogs={blogs} loading={loading} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 border-t border-stone-200/60">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-start">
                        
                        <div className="w-full flex-1 min-w-0 order-1 lg:order-2 space-y-8 md:space-y-12">
                            {loading ? (
                                <div className="space-y-8 md:space-y-12">
                                    <div className="w-full h-96 bg-stone-200 animate-pulse rounded-xl" />
                                    <div className="w-48 h-8 bg-stone-200 animate-pulse rounded" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-64 bg-stone-200 animate-pulse rounded-xl" />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {featuredBlogs && featuredBlogs.length > 0 && (
                                        <FeaturedBlog blog={featuredBlogs[0]} Icon={Star} title={"Featured Blog"} />
                                    )}
                                    
                                    <div className="space-y-6">
                                        <TitleBar title={"Latest Blogs"} Icon={Clock10Icon} onClick={() => navigate("/explore/latest")} />
                                        <BlogGrid blogs={blogs} sliceLimit={6} />
                                    </div>

                                    <div className="space-y-6">
                                        <TitleBar title={"Trending Blogs"} Icon={TrendingUp} onClick={() => navigate("/explore/trending")} />
                                        <BlogGrid blogs={trendingBlogs} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="w-full lg:w-72 xl:w-80 shrink-0 order-2 lg:order-1 lg:sticky lg:top-28">
                            {loading ? (
                                <div className="space-y-6">
                                    <div className="h-48 bg-stone-200 animate-pulse rounded-xl" />
                                    <div className="h-64 bg-stone-200 animate-pulse rounded-xl" />
                                </div>
                            ) : (
                                <Sidebar categories={sortedCategories} tags={tags} authors={featuredAuthors} />
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home;