import { motion } from "motion/react";
import {  Clock3, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogStripeItem({ blog, index }) {
    const navigate = useNavigate();
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-sm hover:border-stone-300 transition-all duration-300 flex items-center h-28 sm:h-24 relative"
        >
            <div className="relative w-24 sm:w-32 h-full flex-shrink-0 overflow-hidden bg-stone-100">
                <motion.img
                    src={blog.coverImage?.url}
                    alt={blog.title}
                    className="w-full h-full object-cover grayscale-[10%]"
                />
            </div>

            <div className="flex-1 min-w-0 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#E0F0FF] border border-[#C8D8E8] text-[#005FA3] text-[9px] font-medium tracking-wider uppercase">
                            {blog.category}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-stone-300" />
                            {blog.author?.name}
                        </span>
                    </div>

                    <h3 className="font-sans font-medium text-stone-900 leading-tight text-sm sm:text-base group-hover:text-[#0077CC] transition-colors duration-200 truncate pr-6 sm:pr-0">
                        {blog.title}
                    </h3>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-stone-400 font-medium font-mono border-t sm:border-t-0 border-stone-100 pt-1.5 sm:pt-0 flex-shrink-0">
                    <span className="flex items-center gap-1 hover:text-stone-600 transition-colors">
                        <Eye size={12} />
                        {blog.views || "0"}
                    </span>
                    <span className="flex items-center gap-1 hover:text-stone-600 transition-colors">
                        <Heart size={11} />
                        {blog.likes || "0"}
                    </span>
                    <span className="flex items-center gap-1 text-stone-400 xs:flex">
                        <Clock3 size={11} />
                        {blog.readTime || "-"}m
                    </span>
                </div>
            </div>

        </motion.div>
    );
}