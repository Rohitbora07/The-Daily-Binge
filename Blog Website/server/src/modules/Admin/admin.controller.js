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

        return res.status(200).json({ success: true, isFeatured: blog.isFeatured, message: blog.isFeatured ? "Blog featured successfully" : "Blog removed from featured" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const toggleComments = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing Blog Id" })
    }
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        blog.allowComments = !blog.allowComments;

        await blog.save()

        return res.status(200).json({ success: true, allowComments: blog.allowComments, message: blog.allowComments ? "Comment enabled successfully" : "Comment disabled successfully" })

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
    console.log(req.body)
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
            return res.status(400).json({ success: false, message: "Blog is already published" });
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
            return res.status(400).json({ success: false, message: "Blog is already drafted" });
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

        const {search, status, isEmailVerified} = req.query

        const filter = {
            role: { $ne: "admin" },
        }

        if(search){
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }

        if(status){
            filter.status = status
        }
        if(isEmailVerified !== undefined){
            filter.isEmailVerified = isEmailVerified === "true"
        }

        const totalUsers = await User.countDocuments(filter)
        
        const users = await User.find(filter).select("-password -VerificationOtp -emailOtpExpiry -passResetOtp -passResetOtpExpiry").sort({ createdAt: -1 }).skip(skip).limit(limit)
        return res.status(200).json({ success: true, users, totalUsers, currentPage: page, totalPages: Math.ceil(totalUsers / limit) })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteOneUser = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing User Id" })
    }
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        if (user.profileImg) {
            await cloudinary.uploader.destroy(user.profileImg);
        }
        await user.deleteOne();
        await Blog.deleteMany({ author: id });
        await Comment.deleteMany({ user: id });

        await Bookmark.deleteMany({ user: id });

        return res.status(200).json({ success: true, message: "User Deleted successfully" })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteManyUsers = async (req, res) => {
    const { userIds } = req.body
    if (!userIds || !userIds.length) {
        return res.status(400).json({ success: false, message: "No users selected" })
    }
    try {
        const users = await User.find({
            _id: {
                $in: userIds
            }
        })
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Users not found" })
        }

        for (const user of users) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg);
            }
        }

        await Promise.all([
            User.deleteMany({ _id: { $in: userIds } }),
            Blog.deleteMany({ author: { $in: userIds } }),
            Comment.deleteMany({ user: { $in: userIds } }),
            Bookmark.deleteMany({ user: { $in: userIds } })
        ]);

        return res.status(200).json({ success: true, message: "Users Deleted successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getUserDetailsById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing User Id" })
    }
    console.log(id)

    try {
        const user = await User.findById(id).select("-password -VerificationOtp -emailOtpExpiry -passResetOtp -passResetOtpExpiry")

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const totalBlogs = await Blog.countDocuments({ author: id })
        const totalBookmarks = await Bookmark.countDocuments({ user: id })
        const totalComments = await Comment.countDocuments({ user: id })
        return res.status(200).json({ success: true, user, totalBlogs, totalBookmarks, totalComments })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const blockUser = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing User Id" })
    }
    const { restrictionReason } = req.body
    if (!restrictionReason) {
        return res.status(400).json({ success: false, message: "Reason required for this action" })
    }
    try {
        const user = await User.findById(id).select("status restrictionReason restrictedAt")

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if (user.status === "blocked") {
            return res.status(400).json({ success: false, message: "User already blocked" })
        }
        user.status = "blocked"
        user.restrictionReason = restrictionReason
        user.restrictedAt = new Date()

        await user.save()
        const details = {
            restrictionReason: user.restrictionReason,
            status: user.status,
            restrictedAt: user.restrictedAt
        }

        return res.status(200).json({ success: true, details, message: "User Blocked Successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const unBlockUser = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing User Id" })
    }
    try {
        const user = await User.findById(id).select("status restrictionReason restrictedAt")

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if (user.status === "active") {
            return res.status(400).json({ success: false, message: "User already unblocked" })
        }
        user.status = "active"
        user.restrictionReason = ""
        user.restrictedAt = null

        await user.save()
        const details = {
            status: user.status
        }

        return res.status(200).json({ success: true, details, message: "User Unblocked Successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}