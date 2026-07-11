import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './src/modules/users/user.route.js';
import blogRouter from './src/modules/Blog/blog.route.js';
import connectDB from './src/config/mongoDB.js';
import 'dotenv/config';
import commentRouter from './src/modules/comments/comment.route.js';
import bookmarkRouter from './src/modules/bookmarks/bookmark.route.js';
import adminBlogRouter from './src/modules/Admin/admin.route.js';


connectDB()

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  

app.use("/api/user", userRouter)
app.use("/api/blog", blogRouter)
app.use("/api/comments", commentRouter)
app.use("/api/bookmark", bookmarkRouter)
app.use("/api/admin", adminBlogRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});