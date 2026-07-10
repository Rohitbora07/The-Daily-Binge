import { motion } from "motion/react";

export default function AdminStatsCard({ icon: Icon, label, value, color, delay = 0 }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: "easeOut" }}
            className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0"
        >
            <div className="flex items-center justify-between mb-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color + "18" }}
                >
                    <Icon size={16} style={{ color }} />
                </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 truncate">{value}</p>
            <p className="text-xs text-stone-500 mt-0.5 truncate">{label}</p>
        </motion.div>
    );
}