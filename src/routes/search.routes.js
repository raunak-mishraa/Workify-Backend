import { Router } from "express"
const router = Router()
import { searchFreelancers, searchPosts } from "../controllers/post.controller.js";

router.route('/freelancers/search').get(searchFreelancers)
router.route('/client_posts/search').get(searchPosts)

export default router