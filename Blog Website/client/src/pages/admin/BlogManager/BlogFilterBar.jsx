import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function BlogFilterBar({ sortBy, setSortBy, sortOptions, status, setStatus, statusOptions, isEmailVerified, setIsEmailVerified, emailVerificationOptions, thirdFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:px-3 rounded-2xl border border-stone-200/60 shadow-sm">

            <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/50 w-full sm:w-auto overflow-x-auto">
                {statusOptions.map((item) => {
                    const isActive = status === item.value;
                    return (
                        <button
                            key={item.value}
                            onClick={() => setStatus(item.value)}
                            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                                isActive
                                    ? "bg-white text-stone-800 font-semibold shadow-xs border border-stone-200/50"
                                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/40"
                            }`}
                        >
                            {item.title}
                        </button>
                    );
                })}
            </div>

            {
                thirdFilter && 
                <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/50 w-full sm:w-auto overflow-x-auto">
                {emailVerificationOptions.map((item) => {
                    const isActive = isEmailVerified === item.value;
                    return (
                        <button
                            key={item.value}
                            onClick={() => setIsEmailVerified(item.value)}
                            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                                isActive
                                    ? "bg-white text-stone-800 font-semibold shadow-xs border border-stone-200/50"
                                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/40"
                            }`}
                        >
                            {item.title}
                        </button>
                    );
                })}
            </div>
            }

            <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full sm:w-auto flex items-center justify-between gap-3 bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 text-stone-700 text-xs font-medium rounded-xl pl-3 pr-3 py-2 transition-colors cursor-pointer select-none"
                >
                    <div className="flex items-center gap-2">
                        <ArrowUpDown size={13} className="text-stone-400" />
                        <span>{selectedOption.title}</span>
                    </div>
                    <ChevronDown size={13} className={`text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-1.5 w-full sm:w-48 bg-white rounded-xl shadow-lg border border-stone-200/80 py-1.5 z-30 overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100/60">
                                {sortOptions.map((option) => {
                                    const isSelected = option.value === sortBy;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-left ${
                                                isSelected
                                                    ? "bg-stone-50/80 text-[#0077CC] font-semibold"
                                                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                            }`}
                                        >
                                            <span>{option.title}</span>
                                            {isSelected && <Check size={13} className="text-[#0077CC] shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}