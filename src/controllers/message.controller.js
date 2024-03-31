import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMessage = asyncHandler(async (req, res) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.user._id,
        message: req.body.desc,
      });

      const savedMessage = await newMessage.save();
      // console.log(savedMessage);
    await Conversation.findOneAndUpdate(
        { id: req.body.conversationId },
        {
          $set: {
            readByFreelancer: !req.isClient,
            readByClient: req.isClient,
            lastMessage: req.body.desc,
          },
        },
        { new: true }
      );
      res.status(201).send(savedMessage);
  
});

const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ conversationId: req.params.id }).populate("userId");
    res.status(200).send(messages);
});

export { 
    createMessage,
    getMessages
 };