import Blog from "./blog.model.js";
import cloudinary from "../../config/cloudinary.js";
import slugify from "slugify"
import Bookmark from "../bookmarks/bookmark.model.js";
import fs from "fs/promises"
import { calculateTrendingScore } from "../../utils/calculateTrending.js"



export const createBlog = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized User" })
        }

        const { title, content, category, tags, visibility, allowComments, excerpt, status, readTime, wordCount } = req.body

        if (!title || !content || !category || !excerpt) return res.status(400).json({ success: false, message: "Missing required details" })

        if (!req.file) return res.status(400).json({ success: false, message: "Cover image is required" })

        console.log(req.file)
        const uploadImage = await cloudinary.uploader.upload(req.file.path,
            {
                resource_type: 'image',
                folder: "blogs"
            })
        console.log("Uploaded Image:", uploadImage)

        // deletes the file from the local server after it is uploaded on cloudinary 
        await fs.unlink(req.file.path)

        let slug = slugify(title, {
            lower: true,
            strict: true
        })

        const existingBlog = await Blog.findOne({ slug })
        if (existingBlog) slug = `${slug}-${Date.now()}`;




        const blog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            readTime: readTime || 0,
            wordCount: wordCount || 0,
            category: category.toLowerCase(),
            visibility: status === "published" ? "public" : visibility || "private",
            tags: tags ? Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim()) : [],
            status: status || "draft",
            allowComments,
            publishedAt: status === "published" ? new Date() : null,
            author: userId,
            coverImage: {
                url: uploadImage.secure_url,
                publicId: uploadImage.public_id
            }
        })

        if (blog.status === "published") {
            blog.trendingScore = calculateTrendingScore(blog)
            await blog.save()
        }

        return res.status(201).json({ success: true, message: "Blog created successfully", blog })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getUserBlogs = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return res.status(400).json({ success: false, message: "Unauthorized User" })
        }

        const filter = {
            author: userId,
            status: "published",
            visibility: "public"
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

        const totalBlogs = await Blog.countDocuments(filter)

        return res.status(200).json({
            success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit)
        })
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

        if(blogs.length === 0) {
            return res.status(404).json({ success: false, message: "No blogs found" })
        }

        return res.status(200).json({ success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit) })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getSingleBlog = async (req, res) => {
    const { slug } = req.params
    if (!slug) {
        return res.status(400).json({ success: false, message: "Missing required details" })
    }
    const userId = req.userId
    try {
        const filter = { slug };

        
        const blog = await Blog.findOne({ slug }).populate("author", "name email profileImg bio")
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        const totalBookmarks = await Bookmark.countDocuments({ blog: blog._id })

        const isOwner = userId && blog.author.toString() !== userId

        if (!isOwner && (blog.status !== "published" || blog.visibility !== "public")) {
            return res.status(403).json({
                success: false,
                message: "You cannot view this blog"
            });
        }

        const isLiked = blog.likedBy.some(id => id.equals(req.userId))
        return res.status(200).json({ success: true, blog: blog, isLiked, totalBookmarks, message: "Blog fetched successfully" })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({success: false,message: "Internal Server Error"})
    }
}

export const deleteBlog = async (req, res) => {
    const { slug } = req.params
    if (!slug) {
        return res.status(400).json({ success: false, message: "Missing required details" })
    }
    try {
        const blog = await Blog.findOne({ slug })
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        const userId = req.userId
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized User" })
        }

        await cloudinary.uploader.destroy(blog.coverImage.publicId);
        await blog.deleteOne()
        return res.status(200).json({ success: true, message: "Blog deleted successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const updateBlog = async (req, res) => {
    const { slug } = req.params
    if (!slug) {
        return res.status(400).json({ success: false, message: "Missing required details" })
    }
    try {
        const blog = await Blog.findOne({ slug })
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        const userId = req.userId
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized User" })
        }

        const { title, content, category, tags, visibility, allowComments, readTime, wordCount, excerpt } = req.body

        if (title) {
            blog.title = title
            blog.slug = slugify(title, {
                lower: true,
                strict: true
            })
        }
        const isCoverImageUpdated = req.file ? true : false
        if (isCoverImageUpdated) {
            await cloudinary.uploader.destroy(blog.coverImage.publicId);
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "blog/cover"
            });
            blog.coverImage = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }
        if (content) blog.content = content
        if (category) blog.category = category
        if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())
        if (visibility) blog.visibility = visibility
        if (allowComments !== undefined) blog.allowComments = allowComments
        if (readTime) blog.readTime = readTime
        if (wordCount) blog.wordCount = wordCount
        if (excerpt) blog.excerpt = excerpt
        await blog.save()

        return res.status(200).json({ success: true, message: "Blog Updated successfully" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getBlogsByCategory = async (req, res) => {
    const { category } = req.params
    if (!category) {
        return res.status(400).json({ success: false, message: "Missing required details" })
    }
    try {

        const filter = {
            category,
            status: "published",
            visibility: "public"
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        const totalBlogs = await Blog.countDocuments(filter)

        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).populate("author", "name email profileImg").skip(skip).limit(limit)

        if (blogs.length === 0) {
            return res.status(404).json({ success: false, message: "No blogs found for this category" })
        }


        return res.status(200).json({ success: true, blogs, totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit), message: `Blogs for category ${category} fetched successfully` })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "blog/editor"
        });

        await fs.unlink(req.file.path);
        return res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const incrementViews = async (req, res) => {
    try {
        const { blogId } = req.params
        if (!blogId) return res.status(400).json({ message: "Blog ID is required" })
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }
        blog.views++;
        blog.trendingScore = calculateTrendingScore(blog)
        await blog.save()
        return res.status(200).json({ success: true })
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.params
        const userId = req.userId
        if (!blogId || !userId) {
            return res.status(400).json({ success: false, message: "Missing required details" })
        }
        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(400).json({ success: false, message: "Blog not found" })
        }

        let isLiked;
        const alreadyLiked = blog.likedBy.some(id => id.equals(userId))
        if (alreadyLiked) {
            blog.likedBy.pull(userId)
            blog.likes--;
            isLiked = false
        } else {
            blog.likedBy.push(userId)
            blog.likes++;
            isLiked = true
        }
        blog.trendingScore = calculateTrendingScore(blog)
        await blog.save()

        return res.status(200).json({ success: true, message: alreadyLiked ? "Like removed successfully" : "Blog Liked successfully", likes: blog.likes, isLiked })

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const getPublishedByTimeBlogs = async (req, res) => {
    try {
        const { range } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        let filter = {
            status: "published",
            visibility: "public"
        }
        const now = Date.now()

        if (range === "24h") {
            filter.publishedAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) }
        }

        if (range === "yesterday") {
            filter.publishedAt = { $gte: new Date(now - 2 * 24 * 60 * 60 * 1000) }
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

export const getTrendingBlogs = async (req, res) => {
    try {
        const { range } = req.query

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 15

        const skip = (page - 1) * limit

        let filter = {
            status: "published",
            visibility: "public",
            trendingScore: { $gt: 0 }
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