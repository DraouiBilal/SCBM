import { Router } from "express";
import { createDeviceController, getAllDevicesController, getDeviceController, getDeviceUsers, openDoorController } from "../controllers/devices";
import { createDeviceValidator, getDeviceWithUsersValidator, openDoorValidator } from "../validators/devices";

const router = Router();

router.get("/", getAllDevicesController);
router.get("/users", getDeviceWithUsersValidator, getDeviceUsers);
router.get("/:id", getDeviceController);
router.post("/", createDeviceValidator, createDeviceController);
router.post("/open", openDoorValidator, openDoorController);

export default router;