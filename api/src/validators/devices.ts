import { z } from "zod";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isDeviceAdmin } from "../middlewares/isDeviceAdmin";
import { upload } from "../storage";
import validate from "../utils/validate";

export const getDeviceWithUsersValidator = [
    isAuthenticated,
    isDeviceAdmin
]

export const getDeviceUsersDataValidator = [
    isAuthenticated,
    isDeviceAdmin
]


export const createDeviceValidator = [
    validate(z.object({
        name: z.string()
    }))
];

export const openDoorValidator = [
    isAuthenticated
]

export const facialDetectionValidator = [
    isAuthenticated,
    upload.single('userImage')
]

export const NFCbadgeValidator = [
    isAuthenticated,
    validate(z.object({
        badgeId: z.string()
    }))
]