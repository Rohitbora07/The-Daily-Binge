import Bookmark from "./bookmark.model.js"
import Blog from "../Blog/blog.model.js"

export const addBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId
        if (!blogId || !userId) {
            return res.status(400).json({ success: false, message: "Missing required details" })
        }
        const existing = await Bookmark.findOne({
            user: userId,
            blog: blogId
        });

        if (existing) {
            return res.status(400).json({success: false,message: "Already bookmarked"});
        }
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }
        const newBookmark = await Bookmark.create({
            blog: blogId,
            user: userId
        })
        await Blog.findByIdAndUpdate(blogId, {
            $inc: { bookmarks: 1 }
        });
        return res.status(201).json({ success: true, message: "Bookmark added successfully", bookmark: newBookmark })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const removeBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId
        if (!blogId || !userId) {
            return res.status(400).json({ success: false, message: "Missing required details" })
        }
        const bookmark = await Bookmark.findOneAndDelete({ blog: blogId, user: userId })
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" })
        }
        await Blog.findByIdAndUpdate(blogId, {
            $inc: { bookmarks: -1 }
        });
        return res.status(200).json({ success: true, message: "Bookmark removed successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getUserBookmarks = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing user id" })
        }
        const bookmark = await Bookmark.find({ user: userId })
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" })
        }
        return res.status(200).json({ success: true, bookmark })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getBlogBookmarks = async (req, res) => {
    try {
        const { blogId } = req.params
        if (!blogId) {
            return res.status(400).json({ success: false, message: "Missing blog id" })
        }
        const bookmark = await Bookmark.find({ blog: blogId })
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" })
        }
        console.log("hit", bookmark)
        return res.status(200).json({ success: true, bookmark })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const isCurrentUserBookmarked = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.userId
    if (!blogId || !userId) {
        return res.status(400).json({ success: false, message: "Missing required details" })
    }
    try {
        const bookmark = await Bookmark.findOne({ blog: blogId, user: userId })
        let isBookmarked;
        if (!bookmark) {
            return res.status(200).json({ success: true, message: "Bookmark not found", isBookmarked: false })
        }
        return res.status(200).json({ success: true, message: "Bookmark found", isBookmarked: true })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
