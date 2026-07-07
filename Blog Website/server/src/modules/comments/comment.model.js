import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    parentComment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    likes: {
        type: Number,
        default: 0
    },

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isEdited: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment