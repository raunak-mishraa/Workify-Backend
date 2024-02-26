import { Router } from "express"
import { createPost, myPost } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/createpost").post(verifyJWT, createPost)
router.route("/mypost").get(verifyJWT, myPost)
export default router