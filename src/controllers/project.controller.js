import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from '../models/project.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const createProject = asyncHandler(async(req, res) => {
    const project = await Project.create({
        title: req.body.title,
        projectUrl: req.body.projectUrl,
        userId:req.user._id
    })
    if(!project){
        return res
        .status(400)
        .json(new ApiError(404, 'Error while creating project'))
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { projects: project._id } },
        { new: true } // Return the updated document
    );

    if (!user) {
        return res
        .status(400)
        .json(new ApiError(404, 'Error while updating user projects'));
    }

    return res
    .status(201)
    .json(new ApiResponse(200,'Project created successfully', project))
})
const getProjects = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    // console.log(userId)
    const projects = await Project.find({userId})
    if(projects.length <= 0 || !projects){
        return res
        .status(203)
        .json(new ApiError(203, "No project found!"))   
    }
    return res
    .status(200)
    .json(new ApiResponse(200, "Data fetched successFully", projects))
})
const deleteProject = asyncHandler(async(req, res) => {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
    if(!deletedProject){
        return res
        .status(404)
        .json(new ApiError(404, "Project not found"))
    }
    return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successFully", deletedProject))
})
export {
    createProject,
    getProjects,
    deleteProject
}