import { Router } from "express";
import { addHistoryController, getAllHistoryController } from "../controllers/history";
import { addHistoryValidator, getAllHistoryValidator } from "../validators/history";

const router = Router();

router.get('/',getAllHistoryValidator,getAllHistoryController);
router.post('/:id',addHistoryValidator,addHistoryController);

export default router;