import Blog from "../Blog/blog.model.js";
import cloudinary from "../../config/cloudinary.js";
import User from "../users/user.model.js";
import Comment from "../comments/comment.model.js"
import Bookmark from "../bookmarks/bookmark.model.js";
import { calculateTrendingScore } from "../../utils/calculateTrending.js";

export const featureBlog = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing Blog Id" })
    }
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        blog.isFeatured = !blog.isFeatured;

        await blog.save()

        return res.status(200).json({ success: true, message: blog.isFeatured ? "Blog featured successfully" : "Blog removed from featured" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteOneBlog = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing Blog Id" })
    }
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        await cloudinary.uploader.destroy(blog.coverImage.publicId)

        await blog.deleteOne();

        await Comment.deleteMany({ blog: id });

        await Bookmark.deleteMany({ blog: id });

        return res.status(200).json({ success: true, message: "Blog Deleted successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteManyBlog = async (req, res) => {
    const { blogIds } = req.body
    if (!blogIds || !blogIds.length) {
        return res.status(400).json({ success: false, message: "No blogs selected" })
    }
    try {
        const blogs = await Blog.find({
            _id: {
                $in: blogIds
            }
        })
        if (blogs.length === 0) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        for (const blog of blogs) {
            await cloudinary.uploader.destroy(blog.coverImage.publicId)
        }

        await Blog.deleteMany({
            _id: {
                $in: blogIds
            }
        });

        await Comment.deleteMany({
            blog: {
                $in: blogIds
            }
        });

        await Bookmark.deleteMany({
            blog: {
                $in: blogIds
            }
        });

        return res.status(200).json({ success: true, message: "Blog Deleted successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}



export const adminStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();

        const published = await Blog.countDocuments({
            status: "published"
        });

        const drafts = await Blog.countDocuments({
            status: "draft"
        });

        const featured = await Blog.countDocuments({
            isFeatured: true
        });

        const users = await User.countDocuments();
        const comments = await Comment.countDocuments();
        const bookmarks = await Bookmark.countDocuments()

        return res.status(200).json({ success: true, totalBlogs, published, drafts, featured, users, comments, bookmarks })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const getAllTimedBlogs = async (req, res) => {
    try {
        const { range } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        let filter = {};
        const now = Date.now()

        if (range === "24h") {
            filter.publishedAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) }
        }

        if (range === "yesterday") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            filter.publishedAt = {
                $gte: yesterday,
                $lt: today
            };
        }

        if (range === "week") {
            filter.publishedAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
        }

        const totalBlogs = await Blog.countDocuments(filter)

        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).populate("author", "name email profileImg").skip(skip).limit(limit)

        return res.status(200).json({ success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit) })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getAllTimedTrendingBlogs = async (req, res) => {
    try {
        const { range } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        let filter = {
            trendingScore: { $gt: 0 },
            status: "published"
        }
        const now = Date.now()


        if (range === "24h") {
            filter.publishedAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) }
        }
        if (range === "week") {
            filter.publishedAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
        }
        if (range === "month") {
            filter.publishedAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
        }

        const totalBlogs = await Blog.countDocuments(filter)

        const blogs = await Blog.find(filter).sort({ trendingScore: -1 }).populate("author", "name email profileImg").skip(skip).limit(limit)

        return res.status(200).json({ success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit) })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        const totalBlogs = await Blog.countDocuments()

        const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "name email profileImg").skip(skip).limit(limit)

        return res.status(200).json({ success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit) })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const publishBlog = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing Blog Id" })
    }
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        if (blog.status === "published") {
            return res.status(400).json({success: false,message: "Blog is already published"});
        }

        blog.status = "published";
        blog.visibility = "public";
        blog.publishedAt = new Date();

        blog.trendingScore = calculateTrendingScore(blog);

        await blog.save();

        return res.status(200).json({ success: true, blog, message: "Blog Published Sucessfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const unPublishBlog = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing Blog Id" })
    }
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        if (blog.status === "draft") {
            return res.status(400).json({success: false,message: "Blog is already drafted"});
        }

        blog.status = "draft";
        blog.visibility = "private";
        blog.publishedAt = null;
        blog.isFeatured = false;

        blog.trendingScore = 0;

        await blog.save();

        return res.status(200).json({ success: true, blog, message: "Blog Drafted Sucessfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15
        const skip = (page - 1) * limit

        const totalUsers = await User.countDocuments()


        const users = await User.find({
            role: { $ne: "admin" }
        }).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)
        return res.status(200).json({ success: true, users, totalUsers, currentPage: page, totalPages: Math.ceil(totalUsers / limit) })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}