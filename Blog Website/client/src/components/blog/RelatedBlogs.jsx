import { motion } from "motion/react";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import BlogGrid from "../BlogGrid";
import { useNavigate } from "react-router-dom";

export default function RelatedBlogs({ relatedBlogs = [], category }) {
    const navigate = useNavigate();
    return (
        <section className="w-full max-w-7xl mx-auto mt-12 md:mt-16 pt-10 md:pt-12 border-t border-stone-200/60">
            <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50 shrink-0">
                        <BookOpen size={13} className="text-[#0077CC]" />
                    </div>
                    <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-stone-900">
                        More to read
                    </h2>
                </div>
                <button
                onClick={() => navigate(`/explore/category/${category}`)}
                className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#0077CC] hover:text-[#005FA3] transition-colors shrink-0 group">
                    View all
                    <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {!relatedBlogs || relatedBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50 text-center">
                    <p className="text-sm font-medium text-stone-500">No related blogs found at the moment.</p>
                </div>
            ) : (
                <div className="w-full">
                    <BlogGrid blogs={relatedBlogs} />
                </div>
            )}
        </section>
    );
}