import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    conversationId: {
        type: String,
        required: true,
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
});

export const Message = mongoose.model("Message", messageSchema);