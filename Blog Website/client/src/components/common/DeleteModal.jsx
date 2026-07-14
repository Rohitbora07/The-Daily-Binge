import { motion } from "motion/react"
import { CircleDashed, AlertTriangle } from "lucide-react"

function DeleteModal({ setShowDeleteModal, handleDelete, deleteLoading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 max-w-sm w-full relative z-10 space-y-4"
            >
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-stone-800">Delete blog post?</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        Are you sure you want to delete <span className="font-semibold text-stone-700"></span>? This action cannot be undone.
                    </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm items-center justify-center flex gap-1"
                    >
                        {deleteLoading ? <CircleDashed size={20} className="animate-spin" /> : "Yes, Delete"}

                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default DeleteModal
