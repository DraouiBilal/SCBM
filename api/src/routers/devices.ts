import { Router } from "express";
import { createDeviceController, getAllDevicesController, getDeviceController } from "../controllers/devices";
import { createDeviceValidator } from "../validators/devices";

const router = Router();

router.get("/", getAllDevicesController);
router.get("/:id",getDeviceController);
router.post("/",createDeviceValidator ,createDeviceController);

export default router;