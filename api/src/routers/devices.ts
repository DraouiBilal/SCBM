import { Router } from "express";
import { createDeviceController, facialDetectionController, getAllDevicesController, getDeviceController, getDeviceUsers, getDeviceUsersDataController, NFCbadgeController, openDoorController } from "../controllers/devices";
import { createDeviceValidator, facialDetectionValidator, getDeviceUsersDataValidator, getDeviceWithUsersValidator, NFCbadgeValidator, openDoorValidator } from "../validators/devices";

const router = Router();

router.get("/", getAllDevicesController);
router.get("/users", getDeviceWithUsersValidator, getDeviceUsers);
// router.get("/:idg", getDeviceController);
router.get("/sync/rasp", getDeviceUsersDataValidator ,getDeviceUsersDataController);
router.post("/", createDeviceValidator, createDeviceController);
router.post("/open", openDoorValidator, openDoorController);
router.post("/facial-detection", facialDetectionValidator, facialDetectionController);
router.post("/nfc-badge", NFCbadgeValidator, NFCbadgeController);

export default router;