import { Router } from "express"
import { createPost, myPost, allPost, bookmarkedPost } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/createpost").post(verifyJWT, createPost)
router.route("/mypost").get(verifyJWT, myPost)
router.route("/allposts").get(allPost)
router.route("/bookmarked").get(verifyJWT,bookmarkedPost)
export default router