import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createProject, getProjects, deleteProject} from '../controllers/project.controller.js'
const router = express.Router();

router.route('/').post(verifyJWT, createProject).get(verifyJWT, getProjects)
router.route('/:projectId').delete(verifyJWT, deleteProject)
export default router;