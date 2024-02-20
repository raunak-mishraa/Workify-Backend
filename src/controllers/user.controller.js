import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {

    //get user details from the frontend
    //validation - not empty
    //check if user already exists
    //check for avatar
    //upload avatar to cloudinary
    //create user object - create entry in the database
    //remove password and refresh token from the response
    //check for user creation
    //return response
    const {username, fullName, email, password} = req.body;

    if(
        [username, fullName, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")  
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "Username or email already taken")
    }
    console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;//the access of files is possible because of the multer middleware

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)//so if the avatar is uploaded on local file then upload it to cloudinary

    if (!avatar) {
        throw new ApiError(400, "avatar is required")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")//what we want to exclude from the response

    if(!createdUser){//if the user is not created
        throw new ApiError(500, "Something went wrong while registering the user") 
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully")//created an object of ApiResponse and passed the values
    )
});



export {registerUser}