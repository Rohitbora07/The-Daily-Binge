import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";
import api from "../../api/axios";
import { CREATE_COMMENT, GET_BLOG_COMMENTS } from "../../constants/route";
import CommentItem from "./CommentItem";

export default function BlogComments({ blog }) {
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [showAll, setShowAll] = useState(false);

    const topLevelComments = comments.filter(comment => !comment.parentComment);

    const getReplies = (commentId) => {
        return comments.filter(comment => comment.parentComment === commentId);
    }

    const visibleComments = showAll ? topLevelComments : topLevelComments.slice(0, 2);

    useEffect(() => {
        const getComments = async () => {
            if (!blog?._id) return;
            try {
                const { data } = await api.get(GET_BLOG_COMMENTS(blog?._id));
                setComments(data.comments || []);
            } catch (error) {
                console.error("Fetch comments error:", error);
            }
        };
        getComments();
    }, [blog?._id]);

    const createComment = async () => {
        if (!commentContent.trim()) return;
        try {
            const { data } = await api.post(CREATE_COMMENT(blog?._id), {
                content: commentContent.trim()
            });
            setComments(prev => [data.comment, ...prev]);
            setCommentContent("");
        } catch (error) {
            console.error("Create comment error:", error?.response?.data?.message);
        }
    };

    const createReply = async (parentCommentId) => {
        if (!replyContent.trim()) return;
        try {
            const { data } = await api.post(CREATE_COMMENT(blog?._id), {
                content: replyContent.trim(),
                parentComment: parentCommentId
            });
            setComments(prev => [...prev, data.comment]);
            setReplyContent("");
            setReplyTo(null);
        } catch (error) {
            console.error("Create reply error:", error?.response?.data?.message);
        }
    };

    return (
        <section className="mt-14 max-w-2xl mx-auto px-4">
            <div className="flex items-center gap-2.5 mb-7">
                <MessageSquare size={18} className="text-stone-700" />
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                    {comments.length} Comments
                </h2>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        rows={3}
                        placeholder="Share your thoughts on this article…"
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all resize-none leading-relaxed"
                    />
                    <AnimatePresence>
                        {commentContent.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="flex justify-end gap-2 mt-2"
                            >
                                <button
                                    onClick={() => setCommentContent("")}
                                    className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={createComment}
                                    className="text-sm font-semibold text-white bg-[#0077CC] hover:bg-[#005FA3] px-5 py-2 rounded-xl transition-colors shadow-sm"
                                >
                                    Post comment
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-2 divide-y divide-stone-50">
                {visibleComments.length > 0 ? (
                    visibleComments.map((c) => (
                        <CommentItem
                            key={c._id}
                            comment={c}
                            getReplies={getReplies}
                            replyTo={replyTo}
                            setReplyTo={setReplyTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            createReply={createReply}
                        />
                    ))
                ) : (
                    <p className="text-center text-sm text-stone-400 py-6">
                        No comments yet. Start the conversation!
                    </p>
                )}
            </div>


            {!showAll && topLevelComments.length > 2 && (
                <button 
                    onClick={() => setShowAll(true)}
                    className="mt-8 mx-auto flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:text-[#005FA3] bg-[#E0F0FF]/40 hover:bg-[#E0F0FF]/70 px-4 py-2 rounded-xl transition-all"
                >
                    <span>Show {topLevelComments.length - 2} more comments</span>
                    <ChevronDown size={15} />
                </button>
            )}
            
            {showAll && topLevelComments.length > 2 && (
                <button 
                    onClick={() => setShowAll(false)}
                    className="mt-8 mx-auto flex items-center gap-1.5 text-sm font-semibold text-[#0077CC] hover:text-[#005FA3] bg-[#E0F0FF]/40 hover:bg-[#E0F0FF]/70 px-4 py-2 rounded-xl transition-all"
                >
                    <span>Collapse comments</span>
                    <ChevronUp size={15} />
                </button>
            )}
        </section>
    );
}
