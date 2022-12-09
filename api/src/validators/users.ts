import { z } from "zod";
import { isAccountOwner } from "../middlewares/isAccountOwner";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isDeviceAdmin } from "../middlewares/isDeviceAdmin";
import validate from "../utils/validate";

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
    isAccountOwner,
    validate(z.object({
        fullname: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        password: z.string().min(8).max(20).optional(),
        status: z.string().optional(),
    }))
]