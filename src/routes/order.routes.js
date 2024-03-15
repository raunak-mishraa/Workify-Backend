import e from 'express';
import express from 'express';
import { createOrder, getOrders } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/:gigId').post(verifyJWT, createOrder)
router.route('/').get(verifyJWT, getOrders)

export default router;