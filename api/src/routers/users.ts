import { Router } from "express";
import { createUserController, deleteUserController, getUserController, loginUser, updateUserController } from "../controllers/users";
import { createUserValidator, getUserValidator, updateUserValidator } from "../validators/users";

const router = Router();

router.get('/me',getUserValidator,getUserController);
router.post('/login',loginUser)
router.post('/signup', createUserValidator, createUserController);
router.patch('/:id', updateUserValidator, updateUserController);
router.delete('/:id',deleteUserController);

export default router;