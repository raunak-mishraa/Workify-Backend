import { Router } from "express"
import { loginUser, registerUser,refreshAccessToken, forgotPassword, resetPassword, updateUser, updateUserProfile, updateUserAvatar, deleteUser, getUser, updateCountry, addSkill, deleteSkill, userSkills, verifyUser, getClientProfile, logOutUser } from "../controllers/user.controller.js"
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
router.route('/user-skill').get(verifyJWT,userSkills)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route('/get-user').get(verifyJWT, getUser)
router.route("/update-profile").put(verifyJWT, updateUserProfile)
router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-country").put(verifyJWT, updateCountry)
router.route("/add-skill").post(verifyJWT, addSkill)
router.route("/delete-skill").delete(verifyJWT, deleteSkill)
router.route("/verify").put(verifyJWT, verifyUser)
router.route("/:id").get(verifyJWT, getClientProfile)

router.route('/logout').post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/delete-account").delete(verifyJWT, deleteUser)
router.route("/update").put(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), updateUser)
export default router