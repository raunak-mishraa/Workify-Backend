import { asyncHandler } from "../utils/asyncHandler.js";
import { Gig } from "../models/gig.model.js";
const createGig = asyncHandler(async (req, res) => {
    if(req.user.isClient) return res.status(403).json({message:"Only freelancers can create gigs"})

    const newGig = await Gig.create({
        userId: req.user._id,
        ...req.body
    })
    console.log(req.user.isClient)
    // const savedGig = await newGig.save()
    return res.status(201).json(newGig)
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