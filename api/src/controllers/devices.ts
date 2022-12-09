import { Request, Response } from "express";
import { createDevice, getAllDevices, getDeviceById } from "../services/devices";
import { generateUUID } from "../utils/generateUUID";

export const getAllDevicesController = async (req: Request, res: Response) => {
    try {
        const devices = await getAllDevices();
        return res.status(200).json({devices});
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}

export const getDeviceController = async (req: Request, res: Response) => {
    try {
        const device = {
            id: req.params.id,
            name:""
        }
        const foundDevice = await getDeviceById(device);
        if(!foundDevice) return res.status(404).json({ message: 'Device not found' });
        return res.status(200).json({device: foundDevice});
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}

export const createDeviceController = async (req: Request, res: Response) => {
    try {
        const device = {
            id: generateUUID(),
            name: req.body.name as string
        }
        const newDevice = await createDevice(device);
        return res.status(200).json({device: newDevice.newDevice, admin: newDevice.deviceAdmin});
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}