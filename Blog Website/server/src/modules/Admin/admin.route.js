import express from "express"
import { userAuth } from "../../middlewares/user.auth.js";
import { adminAuth } from "../../middlewares/admin.auth.js";
import { adminStats, deleteManyBlog, deleteOneBlog, featureBlog, getAllTimedBlogs, getAllTimedTrendingBlogs, publishBlog, unPublishBlog, getAllBlogs, getAllUsers } from "./admin.controller.js";

const adminBlogRouter = express.Router()

adminBlogRouter.use(userAuth)
adminBlogRouter.use(adminAuth)

adminBlogRouter.patch("/blog/:id/feature", featureBlog)
adminBlogRouter.delete("/blog/:id/delete", deleteOneBlog)
adminBlogRouter.delete("/blog/multi/delete", deleteManyBlog)
adminBlogRouter.get("/stats", adminStats)
adminBlogRouter.get("/blog/recent", getAllTimedBlogs)
adminBlogRouter.get("/blog/trending", getAllTimedTrendingBlogs)
adminBlogRouter.get("/blog/all", getAllBlogs)
adminBlogRouter.patch("/blog/:id/publish", publishBlog)
adminBlogRouter.patch("/blog/:id/unpublish", unPublishBlog)

adminBlogRouter.get("/users/all", getAllUsers)

export default adminBlogRouter