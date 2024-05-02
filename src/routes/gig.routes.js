import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'
import { createGig, deleteGig, getGig, getGigs } from '../controllers/gig.controller.js';
const router = express.Router();

router.route('/').post(verifyJWT,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 1
        }
    ]),
    createGig).get(getGigs)
router.route('/:id').delete(verifyJWT, deleteGig)
router.route('/single/:id').get(getGig)
// router.route('/').get(getGigs)

export default router;