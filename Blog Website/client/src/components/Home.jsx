import Hero from './Hero'
import Sidebar from './SideBar'
import FeaturedBlog from './FeaturedBlog'
import BlogGrid from './BlogGrid'
import TrendingBlogs from './TrendingBlogs'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import { GET_ALL_BLOGS } from '../constants/route'
import { Globe, ArrowRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

function Home() {

    const [blogs, setBlogs] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getAll = async () => {
            try {
                const { data } = await api.get(GET_ALL_BLOGS)
                console.log("data", data)
                setBlogs(data.blogs)
            } catch (error) {
                console.log(error)
            }
        }
        getAll()
    }, [])

    if (!blogs) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB] font-sans antialiased text-stone-900">



            <main>
                <Hero blogs={blogs} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200/60">
                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">

                        <div className="w-full lg:w-72 xl:w-80 shrink-0 order-2 lg:order-1 sticky top-28">
                            <Sidebar />
                        </div>
                        <div className="flex-1 min-w-0 order-1 lg:order-2 space-y-12">
                            <FeaturedBlog blog={blogs[0]} />
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200/60">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50">
                                        <Globe size={13} className="text-[#0077CC]" />
                                    </div>
                                    <h2 className="text-xl font-serif font-medium tracking-tight text-stone-900">Latest Articles</h2>
                                </div>

                                <div
                                    onClick={()=> navigate("/explore/latest")}
                                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider py-2 px-3 rounded-3xl text-[#0077CC] hover:text-[#014c81] hover:bg-[#3c8ec8] transition-colors"
                                >
                                    View all <ArrowRight size={13} />
                                </div>
                            </div>
                            <BlogGrid blogs={blogs} />
                            <TrendingBlogs blogs={blogs} />
                        </div>

                    </div>
                </div>
            </main>


        </div>
    )
}

export default Home
