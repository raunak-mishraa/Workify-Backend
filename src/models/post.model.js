import mongoose,{Schema} from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    client:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    budget:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    bookmarkedPost:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{timestamps: true});

export const Post = mongoose.model('Post', postSchema);