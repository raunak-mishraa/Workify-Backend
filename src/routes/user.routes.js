import { Router } from "express"
import { loginUser, registerUser, logOutUser, refreshAccessToken, forgotPassword, resetPassword, updateUser, updateUserProfile, updateUserAvatar, deleteUser, getUser, updateCountry, addSkill, deleteSkill, getSkill } from "../controllers/user.controller.js"
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
router.route('/:id').get(verifyJWT, getUser)
router.route("/update-profile").put(verifyJWT, updateUserProfile)
router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-country").put(verifyJWT, updateCountry)
router.route("/add-skill").post(verifyJWT, addSkill)
router.route("/delete-skill").delete(verifyJWT, deleteSkill)
router.route("/get-skill").get(verifyJWT, getSkill)
//secured route
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/delete-account").delete(verifyJWT, deleteUser)
router.route("/update").put(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), updateUser)
export default router