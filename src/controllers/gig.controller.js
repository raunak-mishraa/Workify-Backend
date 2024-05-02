import { asyncHandler } from "../utils/asyncHandler.js";
import { Gig } from "../models/gig.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const createGig = asyncHandler(async (req, res) => {
    if(req.user.isClient) return res.status(403).json({message:"Only freelancers can create gigs"})
    console.log(req.files)

    const coverImgLocalPath = req.files?.coverImage[0]?.path;
    if(!coverImgLocalPath) {
        return res.status(400).json({message:"Please upload a cover image"});
    }
    
    const coverImage = await uploadOnCloudinary(coverImgLocalPath)
    
    if (!coverImage) {
        throw new ApiError(400, "cover image is required")
    }

    const imagesLocalPath = req.files?.images[0]?.path;
    const images = await uploadOnCloudinary(imagesLocalPath)
    if (!images) {
        throw new ApiError(400, "images are required")
    }
    // const images = req.files?.images?.map(image => image.path)
    const newGig = await Gig.create({
        userId: req.user._id,
        title: req.body.title,
        desc: req.body.description,
        category: req.body.category,
        price: req.body.price,
        cover: coverImage.url,
        images: images.url,
        shortTitle: req.body.serviceTitle,
        shortDesc: req.body.shortDescription,
        deliveryTime: req.body.deliveryTime,
        revisionNumber: req.body.revisionNumber,
        features: JSON.parse(req.body.features)
        // ...req.body
    })
    // console.log(req.user.isClient, coverImage)
    console.log(newGig)
    return res.status(201).json(newGig)
    // return res.status(201).json({message:"Gig created successfully"})
});

const deleteGig = asyncHandler(async (req, res) => {
   const gig = await Gig.findById(req.params.id)
    if(!gig) return res.status(404).json({message:"Gig not found"})
    if(gig.userId.toString() !== req.user._id.toString()) 
    return res
    .status(403)
    .json({message:"You are not authorized to delete this gig"})
    const deleted = await Gig.findByIdAndDelete(req.params.id)
    if(!deleted) return res
    .status(500)
    .json({message:"An error occured while deleting the gig"})
    return res.status(200).json({message:"Gig has been deleted"})
});

const getGig = asyncHandler(async (req, res) => {
    const gig = await Gig.findById(req.params.id)
    if(!gig) return res.status(404).json({message:"Gig not found"})
    return res.status(200).json(gig)
});
const getGigs = asyncHandler(async (req, res) => {
    const query = req.query;
    const filters = {
        ...( query.userId && {userId: query.userId}),
       ...( query.category && {category: query.category}),
       ...((query.min || query.max) && {
        price: {...(query.min && { $gt: query.min}),...(query.max && { $lt: query.max})}}),
       ...(query.search && {title: { $regex: query.search, $options: "i"}})
    };
    const gigs = await Gig.find(filters).sort({[query.sort]: -1})
    return res.status(200).json(gigs)
});
export { 
    createGig,
    deleteGig,
    getGig,
    getGigs
};