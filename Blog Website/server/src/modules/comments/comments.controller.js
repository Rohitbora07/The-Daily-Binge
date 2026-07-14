import Comments from "./comment.model.js"
import Blog from "../Blog/blog.model.js"
import { calculateTrendingScore } from "../../utils/calculateTrending.js"

export const getBlogAllComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({
                message: "Blog ID is required",
            });
        }

        const comments = await Comments.find({blog: blogId,}).populate("user", "name profileImg").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        res.status(500).json({message: "Error fetching comments",error});
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params
        if (!commentId) return res.status(400).json({ message: "Comment ID is required" })
        const comment = await Comments.findById(commentId).populate("user", "name profileImg")
        if (!comment) return res.status(404).json({ message: "Comment not found" })
        res.status(200).json({ comment })
    } catch (error) {
        res.status(500).json({ message: "Error fetching comment", error })
    }
}

export const getAllUserComments = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) return res.status(400).json({ message: "User ID is required" })
        const comments = await Comments.find({ user: userId }).populate("blog", "title").sort({ createdAt: -1 })
        res.status(200).json({ comments })
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error })
    }
}


export const createComment = async (req, res) => {
    try {
        const {blogId} = req.params
        const { content, parentComment = null } = req.body
        const userId = req.userId
        if (!content || !content.trim() || !blogId) {
            return res.status(400).json({ message: "Invalid comment data" })
        }
        
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        if( blog.status !== 'published' || blog.visibility !== 'public') {
            return res.status(403).json({ message: "You are not authorized to comment on this blog" })
        }

        if (!blog.allowComments) {
            return res.status(400).json({ message: "Comments are not allowed for this blog" })
        }

        if (parentComment) {
            const parent = await Comments.findById(parentComment)
            if (!parent || parent.blog.toString() !== blogId) {
                return res.status(400).json({ message: "Invalid parent comment" })
            }
        }

        const comment = await Comments.create({
            user: userId,
            blog: blogId,
            content: content.trim(),
            parentComment
        })

        blog.commentsCount++;
        blog.trendingScore = calculateTrendingScore(blog)

        await blog.save()

        const populatedComment = await Comments.findById(comment._id).populate("user", "name profileImg")

        res.status(201).json({ message: "Comment created successfully", comment: populatedComment })

    } catch (error) {
        res.status(500).json({ message: "Error creating comment", error })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const userId = req.userId
        if (!commentId) return res.status(400).json({ message: "Comment ID is required" })
        const comment = await Comments.findById(commentId)
        if (!comment) return res.status(404).json({ message: "Comment not found" })
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" })
        }
        await Comments.findByIdAndDelete(commentId)
        await Blog.findByIdAndUpdate(comment.blog,
            { $inc: { commentsCount: -1 } }
        )
        res.status(200).json({ message: "Comment deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error })
    }
}
