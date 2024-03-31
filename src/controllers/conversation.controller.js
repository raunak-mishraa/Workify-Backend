import { asyncHandler } from "../utils/asyncHandler.js";
import {Conversation} from '../models/conversation.model.js'
import {ApiError} from "../utils/ApiError.js";

const createConversation = asyncHandler(async(req, res)=>{
  // console.log(req.user._id, req.body.to)
    const newConversation = new Conversation({
        id: req.isClient ? req.user._id + req.body.to : req.body.to + req.user._id,
        clientId: req.isCLient  ? req.body.to : req.user._id,
        freelancerId: req.isClient ? req.user._id : req.body.to,
        readByClient: req.isClient,
        readByFreelancer: !req.isClient,
    })
    const savedConversation = await newConversation.save();
    // console.log(savedConversation)
    res.status(201).send(savedConversation);
})
const getConversations = asyncHandler(async (req, res) => {
  // console.log(req.user._id, req.user.isClient)
  const conversations = await Conversation.find(
      req.user.isClient ? { clientId: req.user._id } : { freelancerId: req.user._id }
  ).sort({ updatedAt: -1 });
  // console.log(conversations)
  res.status(200).send(conversations);
})

const getSingleConversation = asyncHandler(async(req, res)=>{
  const conversation = await Conversation.findOne({ id: req.params.id });
  if (!conversation) return res.status(404).json(new ApiError(404, "Not found!"));
  console.log(conversation)
  res.status(200).send(conversation);
    // // if (!conversation) return next(new ApiError(404, "Not found!"));
    // // res.status(200).send(conversation);
})
const updateConversation = asyncHandler(async(req, res)=>{
    const updatedConversation = await Conversation.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            ...(req.isClient ? { readByClient: true } : { readByFreelancer: true }),
          },
        },
        { new: true }
      );
  
      res.status(200).send(updatedConversation);
})
export {
    createConversation,
    getConversations,
    getSingleConversation,
    updateConversation
} 