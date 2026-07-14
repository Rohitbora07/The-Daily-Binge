// import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // If there's only 1 page or no pages, don't render pagination
    // if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div  className="flex items-center justify-center pt-12 pb-6">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 py-2 rounded-2xl border border-stone-200/80 shadow-sm">
                <motion.button
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.03 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.97 }}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        currentPage === 1
                            ? "text-stone-300 cursor-not-allowed"
                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Prev</span>
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="w-9 h-9 flex items-center justify-center text-stone-400 font-medium text-sm select-none"
                                >
                                    &#8230;
                                </span>
                            );
                        }

                        const isActive = currentPage === page;

                        return (
                            <motion.button
                                key={page}
                                whileHover={{ scale: isActive ? 1 : 1.05 }}
                                whileTap={{ scale: isActive ? 1 : 0.95 }}
                                onClick={() => onPageChange(page)}
                                aria-current={isActive ? "page" : undefined}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all duration-200 ${
                                    isActive
                                        ? "bg-[#0077CC] text-white shadow-md shadow-[#0077CC]/25 cursor-default"
                                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                }`}
                            >
                                {page}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.03 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.97 }}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        currentPage === totalPages
                            ? "text-stone-300 cursor-not-allowed"
                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                </motion.button>
            </div>
        </div>
    );
}