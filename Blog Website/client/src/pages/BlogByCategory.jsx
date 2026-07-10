import { useEffect, useState } from "react"
import api from "../api/axios"
import { BLOGS_BY_CATEGORY } from "../constants/route"
import { useParams } from "react-router-dom"
import BlogGrid from "../components/BlogGrid"
import { StarsIcon, ChevronDown } from "lucide-react";
import SearchBar from "../components/SearchBar"
import { motion } from "motion/react"

// const ITEMS_PER_PAGE = 12
const sortOptions = ["Newest first", "Oldest first", "Most viewed", "Most liked"];

function BlogByCategory() {
    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState(null)
    const [sort, setSort] = useState("Newest first");
    const [sortOpen, setSortOpen] = useState(false);
    const { category } = useParams()
    useEffect(() => {
        const getBlogCat = async () => {
            try {
                const { data } = await api.get(BLOGS_BY_CATEGORY("Entertainment"))
                setBlogs(data.blogs)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        getBlogCat()
    }, [category])

    const seachedBlogs = blogs && blogs.filter(blogs =>
        blogs.title.toLowerCase().includes(search.toLowerCase()) ||
        blogs.author.name.toLowerCase().includes(search.toLowerCase())
    )


    const capitalized = category.charAt(0).toLocaleUpperCase() + category.slice(1);
    if (!blogs) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0077CC]"></div>
            </div>
        );
    }
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50">
                        <StarsIcon size={13} className="text-[#0077CC]" />  
                    </div>
                    <h2 className="text-xl font-serif font-medium tracking-tight text-stone-900">{capitalized}</h2>
                </div>
                <p className="text-sm text-stone-500">
                    {seachedBlogs.length} {seachedBlogs.length === 1 ? "post" : "posts"}
                </p>
            </div>

            <div className=" flex sm:flex-row flex-col justify-between" >
                <SearchBar value={search} setVal={setSearch} />
                <div className=" ml-20">
                    <button
                        onClick={() => setSortOpen(p => !p)}
                        className="flex items-center w-48 justify-center py-3 gap-2 px-4 rounded-2xl border border-stone-200 bg-white text-sm text-stone-600 hover:border-stone-300 transition-all focus:outline-none"
                    >
                        {sort}
                        <ChevronDown
                            size={13}
                            className={`text-stone-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                    {
                        sortOpen &&
                        <motion.ul
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20  mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden"
                        >
                            {sortOptions.map((s) => (
                                <li key={s}>
                                    <button
                                        onClick={() => { setSort(s); setSortOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-stone-50 ${sort === s
                                            ? "text-[#0077CC] font-medium bg-[#E0F0FF]"
                                            : "text-stone-700"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                </li>
                            ))}
                        </motion.ul>
                    }

                </div>
            </div>





            <BlogGrid blogs={seachedBlogs} />
        </div>
    )
}

export default BlogByCategory
