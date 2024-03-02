import { Router } from "express"
import { createPost, myPost, allPost, deletePost } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/createpost").post(verifyJWT, createPost)
router.route("/mypost").get(verifyJWT, myPost)
router.route("/allposts").get(allPost)
router.route("/deletepost/:id").delete(deletePost)
// router.route("/bookmarked").post(verifyJWT,bookmarkedPost)
export default router