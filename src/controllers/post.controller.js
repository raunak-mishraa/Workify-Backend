import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'

import { ApiResponse } from '../utils/ApiResponse.js'
import {Post} from '../models/post.model.js'
const createPost = asyncHandler(async (req, res) => {
    const {title, description, budget, category} = req.body;
    const userId = req.user._id;
    console.log(userId)
    if(
        [title, description, budget, category].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")  
    }
    const post = await Post.create({
        title,
        description,
        budget,
        category,
        client: userId
    })
    if(!post){
        throw new ApiError(500, "Post not created")
    }
    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})
const myPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // console.log(userId)
    const posts = await Post.find({client: userId})
    if(!posts){
        throw new ApiError(404, "No post found")
    }
    return res.status(200).json(new ApiResponse(200, "Posts found",  posts))
})
const allPost = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('client','-password').sort({createdAt: -1})
    if(!posts){
        throw new ApiError(404, "No post found")
    }
    return res.status(200).json(new ApiResponse(200, "Posts found",  posts))
})

const bookmarkedPost = asyncHandler(async (req, res) => {

})
export {
    createPost,
    myPost,
    allPost,
    bookmarkedPost
}