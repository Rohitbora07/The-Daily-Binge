import { AnimatePresence, motion } from "motion/react";
import { Heart, Reply } from "lucide-react";


function CommentItem({ comment, getReplies, replyTo, setReplyTo,  replyContent, setReplyContent, createReply }) {
    const replies = getReplies(comment._id) || [];
    const hasReplies = replies.length > 0;
    const isReplyingToThis = replyTo === comment._id;

    return (
        <div className="group relative pl-4 border-l-2 border-stone-100 focus-within:border-[#0077CC] transition-colors mt-6">
            <div className="flex gap-3">
                <img
                    src={comment.user?.profileImg || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"}
                    alt={comment.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />


                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-stone-900">
                            {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-stone-400">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                        </span>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed break-words">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mt-2.5">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-rose-500 transition-colors">
                            <Heart size={14} />
                            <span>Like</span>
                        </button>
                        <button 
                            onClick={() => {
                                setReplyTo(isReplyingToThis ? null : comment._id);
                                setReplyContent("");
                            }}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isReplyingToThis ? "text-[#0077CC]" : "text-stone-400 hover:text-[#0077CC]"}`}
                        >
                            <Reply size={14} />
                            <span>{isReplyingToThis ? "Cancel" : "Reply"}</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {isReplyingToThis && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4"
                            >
                                <div className="flex gap-3 items-end">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={2}
                                        placeholder={`Reply to ${comment.user?.name || "user"}...`}
                                        className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all resize-none leading-relaxed"
                                    />
                                    <button 
                                        onClick={() => createReply(comment._id)}
                                        disabled={!replyContent.trim()}
                                        className="text-xs font-semibold text-white bg-[#0077CC] hover:bg-[#005FA3] disabled:opacity-50 px-4 py-2.5 rounded-xl transition-all h-fit"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {hasReplies && (
                <div className="mt-2 space-y-1">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            getReplies={getReplies}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            createReply={createReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentItem


