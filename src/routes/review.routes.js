import express from 'express';
const router = express.Router();
import { createReview, deleteReview, getReviews } from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

router.route('/').post(verifyJWT, createReview)
router.route('/:gigId').get(getReviews)
router.route('/:id').delete(verifyJWT, deleteReview)

export default router;