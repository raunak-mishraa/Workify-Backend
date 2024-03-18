import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;//we are storing refresh token into database
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }

} 

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
    console.log("image",req.files)

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
        ...req.body,//i added
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

const loginUser = asyncHandler(async (req, res) =>{
    const {username, email, password} = req.body;
    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(404, "User does not exist!")
    }

    const isPasswordValid = await user.isCorrectPassword(password)

    if(!isPasswordValid){
        throw new ApiError(404, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const accessTokenExpiry = jwt.decode(accessToken).exp;
    const refreshTokenExpiry = jwt.decode(refreshToken).exp;
    console.log(accessTokenExpiry, refreshTokenExpiry)

    const optionsAccess = {
        httpOnly: true,
        secure: true,
        expires: new Date(accessTokenExpiry * 1000)
    };
    
    const optionsRefresh = {
        httpOnly: true,
        secure: true,
        expires: new Date(refreshTokenExpiry * 1000)
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, optionsAccess)
    .cookie("refreshToken", refreshToken, optionsRefresh)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logOutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true//isase hume new updated value milegi, agar old mili to refresh token bhi mil jaayegi jisase logout nahi hoga
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401,"unathourized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid Refresh Token"
            )
    }
})

const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    
    try {
        if(!email){
            throw new ApiError(400, "Email is required")
        }
        const user = await User.findOne({email})
        const {accessToken} = await generateAccessAndRefreshTokens(user._id);
        if(!user){
           return res.json({message: "User not registered with this email"})
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'raunakmshraa.dev@gmail.com',
              pass: 'bdea ceki imjs clid'
            }
          });
          
          var mailOptions = {
            from: 'raunakmshraa.dev@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetpassword/${accessToken}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({message: "Error sending email: " , status:false});
            } else {
              return res.json({message: "Email sent: " , status:true});
            }
          });
    } catch (error) {
        return res.json({message: "Error sending email: " , status:false});
    }
})

const resetPassword = asyncHandler(async(req, res) => {
    const accessToken = req.params.token;
    console.log(accessToken)
    const {password} = req.body;
    console.log(password)

       try {
         const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
         const id = decodedToken._id;
         const hashPassword = await bcrypt.hash(password, 10);
         console.log(hashPassword)
         await User.findByIdAndUpdate({_id:id},{password:hashPassword});
         return res.status(200).json({message: "Password reset successfully", status: true})
       } catch (error) {
        return res.status(400).json({message: "Error resetting password"})
       }
    
})

const updateUser = asyncHandler(async(req, res) => {
    const {username, fullName, email, password} = req.body;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404, "User not found")
    }
    if(username){
        user.username = username;
    }
    if(fullName){
        user.fullName = fullName;
    }
    if(email){
        user.email = email;
    }
    if(password){
        user.password = password;
    }
    await user.save();
    return res.status(200).json({message: "User updated successfully"})
})

const updateUserProfile = asyncHandler(async(req, res) => {
    const {fullName, email, profession} = req.body;
    // if(!fullName || !email || !profession){
    //         throw new ApiError(400, "At least one field is required")
    // }
    if(fullName.trim() === "" || email.trim() === "" || profession.trim() === ""){
        throw new ApiError(400, "At least one field is required")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
       { 
        $set: {
            fullName,
            email,
            profession
        },
       },
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,  "User profile updated successfully", user))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400, "error while uploading avatar")
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,  "User avatar updated successfully",user))
})

const deleteUser = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const password = req.body.password;
    console.log(password)
    const user = await User.findById(userId);
    const isPasswordCorrect = await user.isCorrectPassword(password);
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid password")
    }
    await User.findByIdAndDelete(userId);
    return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"))
})

const getUser = asyncHandler(async(req, res) => {
    const param = req.params.id;

    if (!param) {
        return res.status(400).json({ error: 'User ID is missing' });
    }

    if (!mongoose.Types.ObjectId.isValid(param)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(param);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
})

const updateCountry = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const country =  req.body.country;
    console.log(country)
    let user = await User.findByIdAndUpdate(userId, {
            $set: {
                country
            }
        },
        {
            new: true
        });
    
    if(!user){
        return res.status(200).json({message:"Error"})
    }
    return res.status(200).json({data:user})
})


const addSkill = asyncHandler(async(req, res) => {
   const {skills} = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json(new ApiResponse(400, "Skills must be provided as an array."));
        }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { skills: { $each: skills } } }, // Using $addToSet to avoid duplicate skills
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json(new ApiResponse(404, "User not found."));
    }

    return res.status(200).json(new ApiResponse(200, "Skills added successfully", updatedUser.skills));
    // await User.findByIdAndUpdate(req.user._id, {
    //     $push: {
    //         skills
    //     }
    // },
    // {
    //     new: true
    // })
    
})

const deleteSkill = asyncHandler(async(req, res)=>{
    const {skill} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { skills: skill } },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json(new ApiResponse(404, "User not found."));
    }

    return res.status(200).json(new ApiResponse(200, "Skill deleted successfully", updatedUser.skills));
})
const getSkill = asyncHandler(async(req, res)=>{
    // const userId = req.user._id;
    // const user = await User.find(userId, )
})
export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    updateUser,
    updateUserProfile,
    updateUserAvatar,
    deleteUser,
    getUser,
    updateCountry,
    addSkill,
    deleteSkill,
    getSkill
}


  // "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"