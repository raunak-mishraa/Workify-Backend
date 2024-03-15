import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createGig, deleteGig, getGig, getGigs } from '../controllers/gig.controller.js';
const router = express.Router();

router.route('/').post(verifyJWT, createGig).get(getGigs)
router.route('/:id').delete(verifyJWT, deleteGig)
router.route('/single/:id').get(getGig)
// router.route('/').get(getGigs)

export default router;