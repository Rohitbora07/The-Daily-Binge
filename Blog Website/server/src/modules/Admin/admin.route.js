import express from "express"
import { userAuth } from "../../middlewares/user.auth.js";
import { adminAuth } from "../../middlewares/admin.auth.js";
import { adminStats, deleteManyBlog, deleteOneBlog, featureBlog, getAllTimedBlogs, getAllTimedTrendingBlogs, publishBlog, unPublishBlog, getAllBlogs, getAllUsers, toggleComments, deleteOneUser, deleteManyUsers, getUserAllBlogs, getUserDetailsById, blockUser, unBlockUser } from "./admin.controller.js";

const adminBlogRouter = express.Router()

adminBlogRouter.use(userAuth)
adminBlogRouter.use(adminAuth)

adminBlogRouter.patch("/blog/:id/feature", featureBlog)
adminBlogRouter.patch("/blog/:id/toggle-comments", toggleComments)
adminBlogRouter.post("/blog/:id/delete", deleteOneBlog)
adminBlogRouter.post("/blog/delete", deleteManyBlog)
adminBlogRouter.get("/stats", adminStats)
adminBlogRouter.get("/blog/recent", getAllTimedBlogs)
adminBlogRouter.get("/blog/trending", getAllTimedTrendingBlogs)
adminBlogRouter.get("/blog/all", getAllBlogs)
adminBlogRouter.patch("/blog/:id/publish", publishBlog)
adminBlogRouter.patch("/blog/:id/unpublish", unPublishBlog) 

adminBlogRouter.get("/users/all", getAllUsers)
adminBlogRouter.post("/users/:id/delete", deleteOneUser)
adminBlogRouter.post("/users/delete", deleteManyUsers)
adminBlogRouter.get("/user/:id/details", getUserDetailsById)
adminBlogRouter.patch("/user/:id/block", blockUser)
adminBlogRouter.patch("/user/:id/un-block", unBlockUser)
adminBlogRouter.get("/user/:userId/blogs", getUserAllBlogs)


export default adminBlogRouter