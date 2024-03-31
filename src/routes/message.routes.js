import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createMessage, getMessages } from '../controllers/message.controller.js';
const router = express.Router();

router.route('/').post(verifyJWT, createMessage)
router.route('/:id').get(verifyJWT,getMessages)
export default router;