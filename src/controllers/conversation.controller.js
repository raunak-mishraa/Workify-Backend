import { asyncHandler } from "../utils/asyncHandler.js";
import {Conversation} from '../models/conversation.model.js'

const createConversation = asyncHandler(async(req, res)=>{
    const newConversation = Conversation.create({
        // id: req.isClient ? req.user._id + req.body.to : req.body.to + req.user._id,
        // clientId: req.isCLient ? req.user._id : req.body.to,
        // freelancerId: req.isClient ? req.body.to : req.user._id,
        // readByClient: req.isClient,
        // readByFreelancer: !req.isClient,
    })
})
const getConversations= asyncHandler(async(req, res)=>{

})
const getSingleConversation = asyncHandler(async(req, res)=>{

})
const updateConversation = asyncHandler(async(req, res)=>{

})
export {
    createConversation,
    getConversations,
    getSingleConversation,
    updateConversation
} 