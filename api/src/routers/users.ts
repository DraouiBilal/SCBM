import { Router } from "express";
import { createUserController, deleteUserController, loginUser, updateUserController } from "../controllers/users";
import { createUserValidator, updateUserValidator } from "../validators/users";

const router = Router();

router.post('/login',loginUser)
router.post('/:id', createUserValidator, createUserController);
router.patch('/:id', updateUserValidator, updateUserController);
router.delete('/:id',deleteUserController);

export default router;