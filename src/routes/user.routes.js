import { Router } from "express"
import { loginUser, registerUser, logOutUser, refreshAccessToken, forgotPassword, resetPassword } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
//secured route
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router