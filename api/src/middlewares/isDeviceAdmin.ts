import { Device } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getDeviceById } from "../services/devices";

export const isDeviceAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user.deviceId;
    let device: Device | null = {
        id,
        name: '',
    };

    try {
        device = await getDeviceById(device);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!device)
        return res.status(404).json({ message: 'Device not found' });


    if (req.user.status !== "ADMIN")
        return res.status(401).json({ message: 'Unauthorized' });

    next();
}