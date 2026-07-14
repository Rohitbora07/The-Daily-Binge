import { motion } from "motion/react";
import { Folder, Tag, Users } from "lucide-react";
import BlogAuthorCard from "./blog/BlogAuthorCard";

export default function Sidebar({ categories, tags, authors }) {
    return (
        <div className="space-y-6">


            <div
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-5"
            >
                <h3 className="font-serif font-medium text-stone-900 mb-4 flex items-center gap-2 text-base">
                    <Folder size={16} className="text-[#0077CC]" />
                    Categories
                </h3>
                <div className="space-y-1">

                    {categories.map(({ name, count }) => (
                        <div
                            key={name}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-stone-50 group transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm text-stone-600 group-hover:text-stone-900 font-medium transition-colors">
                                    {name}
                                </span>
                            </div>
                            <span className="text-xs text-stone-500 bg-stone-100 group-hover:bg-[#EBF1F8] group-hover:text-[#0077CC] px-2 py-0.5 rounded transition-colors font-medium">
                                {count.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>


            <div
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-5"
            >
                <h3 className="font-serif font-medium text-stone-900 mb-4 flex items-center gap-2 text-base">
                    <Users size={16} className="text-[#0077CC]" />
                    Our Authors
                </h3>
                <div className="space-y-2">
                    {authors.map((author) => (
                        <BlogAuthorCard key={author._id} author={author} compact />
                    ))}
                </div>
            </div>


            <div
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-5"
            >
                <h3 className="font-serif font-medium text-stone-900 mb-4 flex items-center gap-2 text-base">
                    <Tag size={16} className="text-[#0077CC]" />
                    Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <div
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded bg-[#EBF1F8] text-[#4A6580] border border-[#C8D8E8] hover:bg-stone-200/50 hover:text-stone-900 hover:border-stone-300 transition-colors cursor-pointer"
                        >
                            #{tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}