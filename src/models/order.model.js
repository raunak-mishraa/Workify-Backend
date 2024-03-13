import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema({
    gigId:{
        type: Schema.Types.ObjectId,
        ref: "Gig",
    },
    img:{
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    payment_intent: {
        type: String,
        required: true,
    },
}, {timestamps: true});

export const Order = mongoose.model("Order", orderSchema);