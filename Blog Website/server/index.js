import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import userRouter from './src/modules/users/user.route.js';
import blogRouter from './src/modules/Blog/blog.route.js';
import connectDB from './src/config/mongoDB.js';
import 'dotenv/config';
import commentRouter from './src/modules/comments/comment.route.js';
import bookmarkRouter from './src/modules/bookmarks/bookmark.route.js';
import adminBlogRouter from './src/modules/Admin/admin.route.js';

// Ensure uploads directory exists on host
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

connectDB()

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy for secure cookies in production (Render, Railway, Vercel, etc.)
app.set('trust proxy', 1);

// Flexible CORS for production and development
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/+$/, ''))
    : ['http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(normalized) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  

app.use("/api/user", userRouter)
app.use("/api/blog", blogRouter)
app.use("/api/comments", commentRouter)
app.use("/api/bookmark", bookmarkRouter)
app.use("/api/admin", adminBlogRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});