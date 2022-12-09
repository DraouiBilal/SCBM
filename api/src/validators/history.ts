import { z } from "zod";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isDeviceAdmin } from "../middlewares/isDeviceAdmin";
import validate from "../utils/validate";

export const getAllHistoryValidator = [
    isAuthenticated,
    isDeviceAdmin
]

export const addHistoryValidator = [
    isAuthenticated,
    isDeviceAdmin,
    validate(
        z.object({
            action: z.string()
        })
    )
]