import express from "express"
import { addBookmark, getBlogBookmarks, getUserBookmarks, isCurrentUserBookmarked, removeBookmark } from "./bookmark.controller.js"
import {userAuth} from "../../middlewares/user.auth.js"

const bookmarkRouter = express.Router()

bookmarkRouter.post("/add/:blogId",userAuth, addBookmark)
bookmarkRouter.delete("/delete/:blogId",userAuth, removeBookmark)
bookmarkRouter.get("/blog/:blogId", getBlogBookmarks)
bookmarkRouter.get("/user", userAuth, getUserBookmarks)
bookmarkRouter.get("/user/:blogId", userAuth, isCurrentUserBookmarked )

export default bookmarkRouter 