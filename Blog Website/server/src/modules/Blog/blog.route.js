import { createBlog, getUserBlogs, getSingleBlog, uploadImage, getBlogsByCategory, incrementViews, toggleLike, getPublishedByTimeBlogs, getTrendingBlogs, updateBlog, deleteBlog, getFeaturedBlogs } from "./blog.controller.js"
import upload from "../../middlewares/upload.js"
import { userAuth } from "../../middlewares/user.auth.js"
import express from "express"

const blogRouter = express.Router()
blogRouter.post("/create", userAuth, upload.single("coverImage"), createBlog)
blogRouter.get("/category/:category", userAuth, getBlogsByCategory)
blogRouter.get("/single/:slug", userAuth, getSingleBlog)
blogRouter.post("/single/:slug/delete", userAuth, deleteBlog)
blogRouter.put("/update/:slug", userAuth, upload.single("coverImage"), updateBlog)
blogRouter.post("/upload-image", userAuth, upload.single("image"), uploadImage)
blogRouter.post("/:blogId/view", incrementViews)
blogRouter.post("/:blogId/like", userAuth, toggleLike)
blogRouter.get("/published/all-blogs", getPublishedByTimeBlogs )
blogRouter.get("/trending",getTrendingBlogs)
blogRouter.get("/featured", getFeaturedBlogs)
export default blogRouter