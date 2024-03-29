import express from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getConversations, createConversation, getSingleConversation, updateConversation} from '../controllers/conversation.controller.js'
const router = express.Router();

router.route('/').get(verifyJWT, getConversations)
router.route('/').post(verifyJWT, createConversation)
router.route('/single/:id').get(verifyJWT, getSingleConversation)
router.route('/:id').put(verifyJWT, updateConversation)

export default router;