import { z } from "zod";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isDeviceAdmin } from "../middlewares/isDeviceAdmin";
import validate from "../utils/validate";

export const getDeviceWithUsersValidator = [
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
    validate(z.object({
        image: z.string()
    }))
]

export const NFCbadgeValidator = [
    isAuthenticated,
    validate(z.object({
        badgeId: z.string()
    }))
]