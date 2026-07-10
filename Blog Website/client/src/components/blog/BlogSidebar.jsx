import { motion } from "motion/react";
import { TrendingUp, Tag, Hash } from "lucide-react";
import BlogAuthorCard from "./BlogAuthorCard";


export default function BlogSidebar({tags, categoryMap, authors, title}) {
    console.log(authors)
    return (
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">

            

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <Hash size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">
                        {title} categories
                    </h3>
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
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                    <TrendingUp size={15} className="text-[#0077CC]" />
                    <h3 className="text-sm font-semibold text-stone-800">{title} Authors</h3>
                </div>
                <ul className="divide-y divide-stone-100">
                    {authors.map((author) => (
                        <BlogAuthorCard author={author} compact />
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}