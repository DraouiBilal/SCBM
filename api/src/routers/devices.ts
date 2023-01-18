import { Router } from "express";
import { createDeviceController, facialDetectionController, getAllDevicesController, getDeviceController, getDeviceUsers, NFCbadgeController, openDoorController } from "../controllers/devices";
import { createDeviceValidator, facialDetectionValidator, getDeviceWithUsersValidator, NFCbadgeValidator, openDoorValidator } from "../validators/devices";

const router = Router();

router.get("/", getAllDevicesController);
router.get("/users", getDeviceWithUsersValidator, getDeviceUsers);
router.get("/:id", getDeviceController);
router.post("/", createDeviceValidator, createDeviceController);
router.post("/open", openDoorValidator, openDoorController);
router.post("/facial-detection", facialDetectionValidator, facialDetectionController);
router.post("/nfc-badge", NFCbadgeValidator, NFCbadgeController);

export default router;