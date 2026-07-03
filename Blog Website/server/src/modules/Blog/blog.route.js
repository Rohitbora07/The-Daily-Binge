import { createBlog, getUserBlogs, getSingleBlog, getAllBlogs, uploadImage } from "./blog.controller.js"
import upload from "../../middlewares/upload.js"
import { userAuth } from "../../middlewares/user.auth.js"
import express from "express"

const blogRouter = express.Router()
blogRouter.get("/all", getAllBlogs)
blogRouter.post("/create", userAuth, upload.single("coverImage"), createBlog)
blogRouter.get("/:slug", getSingleBlog)
blogRouter.post("/upload-image", userAuth, upload.single("image"), uploadImage)

export default blogRouter