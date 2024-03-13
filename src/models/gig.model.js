import mongoose,{Schema} from 'mongoose';

const gigSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    totalStars:{
        type: Number,
        default: 0,
    },
    starNumber:{
        type: Number,
        required: false,
    },
    category:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cover:{
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    shortTitle:{
        type: String,
        required: true,
    },
    shortDesc:{
        type: String,
        required: true,
    },
    deliveryTime:{
        type: Number,
        required: true,
    },
    revisionNumber:{
        type: Number,
        required: true,
    },
    features:{
        type: [String],
        required: false,
    },
    sales:{
        type: Number,
        default: 0,
    },
},{timestamps: true});

export const Gig = mongoose.model('Gig', gigSchema);