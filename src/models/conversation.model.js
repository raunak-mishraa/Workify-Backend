import mongoose, {Schema} from "mongoose";

const conversationSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    readByFreelancer: {
        type: Boolean,
        default: false,
    },
    readBtClient: {
        type: Boolean,
        default: false,
    },  
    lastMessage: {
        type: String,
        required: false,
    },
}, {timestamps: true});

export const Conversation = mongoose.model("Conversation", conversationSchema);