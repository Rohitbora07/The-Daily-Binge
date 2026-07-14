import { motion } from "motion/react";
import { TrendingUp, Tag, Hash, ArrowRight, Users } from "lucide-react";
import BlogAuthorCard from "./BlogAuthorCard";
import { useNavigate } from "react-router-dom";

export default function BlogSidebar({ tags, categoryMap, authors, title }) {
    const navigate = useNavigate();
    return (
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-6 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Hash size={15} className="text-[#0077CC]" />
                        <h3 className="text-sm font-semibold text-stone-800">
                            {title} categories
                        </h3>
                    </div>
                    <div 
                    onClick={() => navigate("/explore/category")}
                     className="flex items-center gap-1.5 text-sm font-medium text-[#0077CC] hover:scale-95 transition-transform duration-200 cursor-pointer">
                        <span className="text-sm font-medium text-[#0077CC]">View</span>
                        <ArrowRight size={15} className="text-[#0077CC]" />
                    </div>

                </div>
                <ul className="p-4 space-y-2">
                    {Array.from(categoryMap).map(([value, key]) => (
                        <li key={value}>
                            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group">
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: "#0077CC" }}
                                    />
                                    <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                                        {value}
                                    </span>
                                </div>
                                <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                                    {key}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Tag size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">{title} tags</h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <motion.button
                            key={tag}
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: 0.03 * i }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            className="text-xs font-medium text-stone-600 bg-stone-50 hover:bg-[#E0F0FF] hover:text-[#0077CC] border border-stone-200 hover:border-[#C8D8E8] px-3 py-1.5 rounded-xl transition-all duration-200"
                        >
                            {tag}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-6 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={15} className="text-[#0077CC]" />
                        <h3 className="text-sm font-semibold text-stone-800">
                            {title} authors
                        </h3>
                    </div>
                    <div 
                    onClick={() => navigate("/explore/authors")}
                     className="flex items-center gap-1.5 text-sm font-medium text-[#0077CC] hover:scale-95 transition-transform duration-200 cursor-pointer">
                        <span className="text-sm font-medium text-[#0077CC]">View</span>
                        <ArrowRight size={15} className="text-[#0077CC]" />
                    </div>

                </div>
                <ul className="divide-y divide-stone-100">
                    {authors.map((author) => (
                        <BlogAuthorCard key={author?._id} author={author} compact />
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}