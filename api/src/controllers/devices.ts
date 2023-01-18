import { Device } from "@prisma/client";
import { Request, Response } from "express";
import { createDevice, getAllDevices, getDeviceById, getDeviceWithUsers, openDoor } from "../services/devices";
import { addHistory } from "../services/history";
import { sockets } from "../socketio/initSocket";
import { generateUUID } from "../utils/generateUUID";

import fs from "fs/promises"
import { runCommand } from "../utils/runCommand";
import { compareImages, findPhoneInImage, getImageCode, saveImage } from "../services/image";
import { getUserImages } from "../services/users";

export const getAllDevicesController = async (req: Request, res: Response) => {
    try {
        const devices = await getAllDevices();
        return res.status(200).json({ devices });
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}

export const getDeviceController = async (req: Request, res: Response) => {
    try {
        const device = {
            id: req.params.id,
            name: ""
        }
        const foundDevice = await getDeviceById(device);
        if (!foundDevice) return res.status(404).json({ message: 'Device not found' });
        return res.status(200).json({ device: foundDevice });
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}

export const getDeviceUsers = async (req: Request, res: Response) => {

    const device = {
        id: req.user.deviceId,
        name: ""
    }

    try {
        const foundDevice = await getDeviceWithUsers(device);
        if (!foundDevice) return res.status(404).json({ message: 'Device not found' });
        return res.status(200).json({ device: foundDevice });
    } catch (err) {
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
        return res.status(200).json({ device: newDevice.newDevice, admin: newDevice.deviceAdmin });
    }
    catch (err) {
        return res.status(500).json({ err, message: 'Server Error' });
    }
}

export const openDoorController = async (req: Request, res: Response) => {

    const id = req.user.deviceId;

    let device: Device | null;

    try {
        device = await getDeviceById({ id, name: '' });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }

    if (!device) return res.status(404).json({ message: 'Device not found' });

    let result = false;
    try {
        result = await openDoor({ device, user: req.user, method: "MANUAL" });
    } catch (err) {
        return res.status(400).json({ message: "Device not connected", open: false });
    }
    if (!result)
        return res.status(400).json({ message: "Device not connected", open: false });
    return res.status(200).json({ message: 'Door opened', open: true });
}

export const facialDetectionController = async (req: Request, res: Response) => {

    let device: Device | null = null;

    try {
        device = await getDeviceById({ id: req.user.deviceId, name: '' });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }

    if (!device) return res.status(404).json({ message: 'Device not found' });

    const { image } = req.body;

    const receivedImagePath = "/tmp/SCBM/images/userImage.jpeg";
    const savedImagePath = "/tmp/SCBM/images/savedUserImage.jpeg";
    let open = false;

    try {
        const userImagesPromise = getUserImages(device)
        const savedImagePromise = saveImage(image, receivedImagePath);

        let userImages: { image: string | null }[] = [];
        try {
            const [userImagesTmp, _] = await Promise.all([userImagesPromise, savedImagePromise]);
            userImages = userImagesTmp;

            // const phoneExists = await findPhoneInImage(receivedImagePath);

            // if (phoneExists) 
            //     return res.status(400).json({ message: "Phone detected", open: false });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' });
        }

        for (let i = 0; i < userImages.length; i++) {

            const userImage = userImages[i];
            if (!userImage.image) continue;

            await saveImage(userImage.image, savedImagePath);

            open = await compareImages(savedImagePath, receivedImagePath);

            if (!open) return res.status(400).json({ message: "Facial detection failed, face not registered maybe?", open });


            let opened = false;
            try {
                opened = await openDoor({ device, user: req.user, method: "Face" });
            } catch (err) {
                return res.status(400).json({ message: "Device not connected", open: false });
            }
            if (!opened)
                return res.status(400).json({ message: "Device not connected", open: false });

        };
    } catch (err: unknown) {
        console.log(err);
    }

    res.status(200).json({ message: "Opened the door", open })
}

export const NFCbadgeController = async (req: Request, res: Response) => {

    let device: Device | null = null;

    try {
        device = await getDeviceById({ id: req.user.deviceId, name: '' });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }

    if (!device) return res.status(404).json({ message: 'Device not found' });

    const { badgeId } = req.body;

    const userBadgeId = req.user.badgeId;

    if (!userBadgeId) return res.status(400).json({ message: "No badge id", open: false });

    if (userBadgeId !== badgeId) return res.status(400).json({ message: "Wrong badge id", open: false });

    let opened = false;
    try {
        opened = await openDoor({ device, user: req.user, method: "Badge" });
    } catch (err) {
        return res.status(400).json({ message: "Device not connected", open: false });
    }
    if (!opened)
        return res.status(400).json({ message: "Device not connected", open: false });

    res.status(200).json({ message: "Opened the door", open: true })
}