import { Router } from "express"
import { createPost, myPost, allPost, deletePost, toggleBookmark, getBookmarkedPosts } from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/createpost").post(verifyJWT, createPost)
router.route("/mypost").get(verifyJWT, myPost)
router.route("/allposts").get(allPost)
router.route("/deletepost/:id").delete(deletePost)
router.route("/toggle-bookmark").post(verifyJWT, toggleBookmark)
router.route("/get-bookmarked-posts").get(verifyJWT, getBookmarkedPosts)
export default router