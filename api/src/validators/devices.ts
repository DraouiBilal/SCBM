import { z } from "zod";
import validate from "../utils/validate";

export const createDeviceValidator = [
    validate(z.object({
        name: z.string()
    }))
];