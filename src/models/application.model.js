import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    coverLetter: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
        required: true,
    },
})

export const Application = mongoose.model("Application", applicationSchema);