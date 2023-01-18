import { z } from "zod";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isDeviceAdmin } from "../middlewares/isDeviceAdmin";
import validate from "../utils/validate";

export const getUserValidator = [
    isAuthenticated,
]

export const createUserValidator = [
    isAuthenticated,
    isDeviceAdmin,
    validate(z.object({
        fullname: z.string(),
        email: z.string().email(),
        phone: z.string(),
        password: z.string().min(8).max(20),
        status: z.string(),
    }))
]

export const updateUserValidator = [
    isAuthenticated,
    validate(z.object({
        fullname: z.string().nullish(),
        email: z.string().email().nullish(),
        phone: z.string().nullish(),
        password: z.string().min(8).max(20).nullish(),
        badgeId: z.string().nullish(),
        image: z.string().nullish()
    }))
]