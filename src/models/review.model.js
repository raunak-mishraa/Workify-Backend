import mongoose,{Schema} from "mongoose";

const reviewSchema = new Schema({
    gigId:{
        type: Schema.Types.ObjectId,
        ref: "Gig",
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    star:{
        type: Number,
        required: true,
        enum: [1,2,3,4,5],
    },
    desc: {
        type: String,
        required: true,
    },
},{timestamps: true
});

export const Review = mongoose.model("Review", reviewSchema);