import { Application } from "../models/application.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
const createApplication = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        console.log(userId);
        const  postId = req.params.id;
        console.log(postId);
        const {coverLetter} = req.body;
        const attachmentFile = req.files?.attachment[0]?.path;
        if(!attachmentFile){
            return res.status(400).json({error: "Attachment is required"});
        }
        const attachment = await uploadOnCloudinary(attachmentFile);
        if(!attachment){
            return res.status(400).json(
                new ApiError(400, "Something went wrong while uploading the attachment",)
            )
        }
        const application = await Application.create({
            userId,
            postId,
            coverLetter,
            attachment:attachment.url,
        });
        const createdApplication = await Application.findById(application._id);
        if(!createdApplication){
            return res.status(500).json({error: "Something went wrong while creating the application"});
        }
        return res.status(201).json(
            new ApiResponse(201, "Application created successfully",  createdApplication)
        );
})
const getApplications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const posts = await Post.find({client: userId})
    const postIds = posts.map(post => post._id);
    const applications = await Application.find({ postId: { $in: postIds }}).populate('postId').populate('userId', '-password -refreshToken -isClient -createdAt -updatedAt').sort({ _id: -1 });
    return res.status(200).json(
        new ApiResponse(200, 'Applications fetched successfully', applications)
    )
})
const myApplications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const applications = await Application.find({ userId }).populate('postId').sort({ _id: -1 });
    if(!applications){
        return res.status(404).json(
            new ApiError(404, 'No applications found')
        )
    }
    return res.status(200).json(
        new ApiResponse(200, 'Applications fetched successfully', applications)
    )
});
const deleteApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const userId = req.user._id;
    console.log(applicationId, userId);
    const application = await Application.findByIdAndDelete(applicationId);
    if(!application){
        return res.status(404).json(
            new ApiError(404, "You are not authorized to delete this application")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, 'Application deleted successfully')
    )
})

const updateApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    console.log(applicationId);
    const userId = req.user._id;
    const { isCompleted } = req.body;
    console.log(isCompleted);
    const application = await Application.findByIdAndUpdate(applicationId, { isCompleted }, { new: true });
    if(!application){
        return res
        .status(404)
        .json(
            new ApiError(404, "Application not found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, 'Application updated successfully', application)
    )
});

const getApplication = asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId).populate('userId postId', '-password -refreshToken -isClient -createdAt -updatedAt');
    if(!application){
        return res.status(404).json(
            new ApiError(404, 'Application not found')
        )
    }
    return res.status(200).json(
        new ApiResponse(200, 'Application fetched successfully', application)
    )
})
export { 
    createApplication,
    getApplications,
    myApplications,
    deleteApplication,
    updateApplication,
    getApplication
 };

//  .populate('userId' , '-password -refreshToken -isClient -createdAt -updatedAt');