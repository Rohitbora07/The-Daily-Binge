import express from "express"
import {userAuth} from "../../middlewares/user.auth.js"
import { createComment, deleteComment, getBlogAllComments, getAllUserComments, getCommentById } from "./comments.controller.js"

const commentRouter = express.Router()

commentRouter.post("/post/:blogId", userAuth, createComment)
commentRouter.get("/blog/:blogId", getBlogAllComments)
commentRouter.get("/user/:userId", getAllUserComments)
commentRouter.get("/get/:commentId", getCommentById)
commentRouter.get("/delete/:commentId",userAuth, deleteComment)

export default commentRouter