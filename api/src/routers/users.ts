import { Router } from "express";
import { createUserController, deleteUserController, getUserController, loginUser, updateUserController, updateUserImageController } from "../controllers/users";
import { createUserValidator, getUserValidator, updateUserImageValidator, updateUserValidator } from "../validators/users";

const router = Router();

router.get('/me',getUserValidator,getUserController);
router.post('/login',loginUser)
router.post('/signup', createUserValidator, createUserController);
router.patch('/me', updateUserValidator, updateUserController);
router.patch('/me/image', updateUserImageValidator, updateUserImageController);
router.delete('/:id',deleteUserController);

export default router;