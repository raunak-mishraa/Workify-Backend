import {Review} from "../models/review.model.js";
import { Gig } from "../models/gig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createReview = async (req, res) => {
    if (!req.user.isClient) {
        return res.status(401).json({ message: "Freelancer can't create a review" });
    }

    const review = await Review.findOne({
        gigId: req.body.gigId,
        userId: req.user._id,
    });

    if (review) {
        return res.status(403).json({ message: "You have already reviewed this gig" });
    }

    const newReview = await Review.create({
        userId: req.user._id,
        gigId: req.body.gigId,
        desc: req.body.desc,
        star: req.body.star,
    });

    if (!newReview) {
        return res.status(400).json({ message: "Something went wrong" });
    }

    await Gig.findByIdAndUpdate(req.body.gigId, { $inc: { totalStars: req.body.star, starNumber: 1 } });

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            "Review created successfully",
            newReview
        )
    );
  
};
const getReviews = async (req, res) => {
    const reviews = await Review.find({gigId: req.params.gigId})
    // console.log(reviews)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Reviews fetched successfully",
            reviews
        )
    );
};

const deleteReview = async (req, res) => {

};
export { 
    createReview,
    getReviews,
    deleteReview
}