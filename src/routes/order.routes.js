import e from 'express';
import express from 'express';
import { intent, getOrders } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

// router.route('/:gigId').post(verifyJWT, createOrder)
router.route('/').get(verifyJWT, getOrders)
router.route("/create-payment-intent/:id").post(verifyJWT, intent)

export default router;