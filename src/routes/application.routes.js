import { Router } from "express";
import { createApplication, getApplications, myApplications, deleteApplication } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/createapplication/:id").post(verifyJWT,
    upload.fields([
        {
            name: "attachment",
            maxCount: 1
        }
    ]),
    createApplication);
router.route("/getapplications").get(verifyJWT, getApplications);
router.route("/myapplications").get(verifyJWT, myApplications);
router.route("/deleteapplication/:id").delete(verifyJWT, deleteApplication);

export default router;