import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "") 
     console.log(token,'token')
     if(!token){
      console.log('token not found')
         throw new ApiError(401, "Unauthorized request")
     }
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    //  console.log(user)
     if(!user){
         throw new ApiError(401, "Invalid Access Token")
     }
     req.user = user;//yaha per hum ek naya object add kar rahe user object
    //  console.log(req.user._id,'req.user')
     next();
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
   }
})


// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// export const verifyJWT = asyncHandler(async (req, _, next) => {//yaha pe hum res use nahi kar rahe the so we did _
//    try {
//      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "") 
 
//      if(!token){
//          throw new ApiError(401, "Unauthorized request")
//      }
//      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
//      if(!user){
//          throw new ApiError(401, "Invalid Access Token")
//      }
//      req.user = user;//yaha per hum ek naya object add kar rahe user object
//      next();
//    } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid Access Token")
//    }
// })