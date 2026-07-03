import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function BlogPagination({ page, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12"
        >
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={15} />
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${page === p
                            ? "bg-[#0077CC] text-white border border-[#0077CC]"
                            : "border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={15} />
            </button>
        </motion.div>
    );
}