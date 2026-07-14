import { motion } from "motion/react";
import { Eye, Clock, Calendar } from "lucide-react";
import BlogShareBar from "../../components/blog/BlogShareBar";
import BlogAuthorCard from "../../components/blog/BlogAuthorCard";
import BlogComments from "../../components/comments/BlogComments";
import RelatedBlogs from "../../components/blog/RelatedBlogs";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GET_SINGLE_BLOG, VIEW_INC, BLOGS_BY_CATEGORY } from "../../constants/route";
import api from "../../api/axios";
import BlogContent from "../../components/blog/BlogContent";


export default function BlogDetails() {

    const { slug } = useParams()
    const [blog, setBlog] = useState(null)
    const [author, setAuthor] = useState(null)
    const [liked, setLiked] = useState(false)
    const [similarBlogs, setSimilarBlogs] = useState([])

    useEffect(() => {
        const getSingleBlog = async () => {
            try {
                const { data } = await api.get(GET_SINGLE_BLOG(slug))
                const {data: similar} = await api.get(`${BLOGS_BY_CATEGORY(data.blog.category)}?limit=3`)
                setSimilarBlogs(similar.blogs.filter(b => b._id !== data.blog._id))
                console.log(data)
                setLiked(data.isLiked)
                setBlog(data.blog)
                setAuthor(data.blog.author)
            } catch (error) {
                console.log(error)
            }
        }
        getSingleBlog()
    }, [slug])

    
    useEffect(()=> {
        if( blog?._id ) api.post(VIEW_INC(blog._id))
    },[blog?._id])

    if (!blog) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }

    const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-white mt-28"
        >


            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8"
            >
                <div className="max-w-3xl mx-auto text-center">

                    <span className="inline-block text-xs font-bold text-[#0077CC] bg-[#E0F0FF] px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                        {blog.category}
                    </span>

 
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-5">
                        {blog.title}
                    </h1>


                    <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                        {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <img
                                src={author.profileImg}
                                alt={author.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100"
                            />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-stone-800">
                                    {author.name}
                                </p>
                                <p className="text-xs text-stone-400">{author.role}</p>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-stone-200 hidden sm:block" />

                        <div className="flex items-center gap-4 text-xs text-stone-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-stone-400" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-stone-400" />
                                {blog.readTime || "-"} min read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye size={13} className="text-stone-400" />
                                {blog.views || "-"} views
                            </span>
                        </div>
                    </div>
                </div>
            </motion.section>


            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mb-12"
            >
                <div className="rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: "21/9" }}>
                    <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex gap-8 xl:gap-14 items-center justify-center">


                    <div className="hidden lg:flex flex-col items-center sticky top-20 flex-shrink-0 pt-2">
                        <BlogShareBar blog={blog} liked={liked} setLiked={setLiked} />
                    </div>


                    <div className="flex-1 min-w-0 max-w-5xl">


                        <div className="flex lg:hidden items-center gap-3 mb-8 pb-6 border-b border-stone-100">
                            <BlogShareBar blog={blog} liked={liked} setLiked={setLiked} />
                        </div>

                        {/* Prose */}
                        <div
                            className="prose-content text-stone-700 leading-[1.9] text-[1.0625rem]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >

                            <BlogContent content={JSON.parse(blog.content)} />
                        </div>

                        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-stone-100">
                            {blog.tags.map((tag) => (
                                <button
                                    key={tag}
                                    className="text-xs font-medium text-stone-600 bg-stone-50 hover:bg-[#E0F0FF] hover:text-[#0077CC] border border-stone-200 hover:border-[#C8D8E8] px-3 py-1.5 rounded-xl transition-all"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10">
                            <BlogAuthorCard author={author} />
                        </div>


                        <BlogComments blog={blog} />


                        <RelatedBlogs relatedBlogs={similarBlogs} category={blog.category} />

                        <div className="h-16" />
                    </div>

                </div>
            </div>
        </motion.div>
    );
}