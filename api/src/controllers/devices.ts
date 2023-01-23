import { Device, User } from "@prisma/client";
import { Request, Response } from "express";
import { createDevice, getAllDevices, getDeviceById, getDeviceWithUsers, openDoor } from "../services/devices";
import { generateUUID } from "../utils/generators";
import {imageToBase64} from "../utils/imageToBase64"
import { compareImages, findPhoneInImage, getImageCode, saveImage } from "../services/image";
import { getUserImages } from "../services/image";
import { addHistory } from "../services/history";
import { sendEmail } from "../services/email";
import { findUserById } from "../services/users";

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
        console.log(req.body);
        
        const device = {
            id: generateUUID(),
            name: req.body.name as string
        }
        const newDevice = await createDevice(device);
        return res.status(200).json({ device: newDevice.newDevice, admin: newDevice.deviceAdmin });
    }
    catch (err) {
        console.error(err);
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
    console.log(device);
    
    if (!device) return res.status(404).json({ message: 'Device not found' });

    const receivedImagePath = `${process.env.BASE_PATH}/src/storage/images/userImage.jpeg`;
    const deviceImagesPath = `${process.env.BASE_PATH}/src/storage/images/${req.user.deviceId}`;
    let open = false;

    try {
        let userImages: string[] = [];
        let userId = "", user: User | null = null;
        try {
            userImages = await getUserImages(device)
            
            const phoneExists = await findPhoneInImage(receivedImagePath);
            console.log("Phone exists", phoneExists);
            
            if (phoneExists) 
                return res.status(400).json({ message: "Phone detected", open: false });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' });
        }
        
        for (let i = 0; i < userImages.length; i++) {
            const userImage = userImages[i];
            const savedImagePath = `${deviceImagesPath}/${userImage}`;
            console.log(savedImagePath);
            open = await compareImages(savedImagePath, receivedImagePath);
            console.log("open: " + open);
            
            if(open){
                userId = userImage.split(".")[0];
                console.log(userImage);
                break;
            } 
        }
        if (!open) return res.status(400).json({ message: "Facial detection failed, face not registered maybe?", open });

        try {
            user = await findUserById(userId);
        } catch (err) {
            return res.status(500).json({ message: 'Server Error' });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        let history = {
            id: generateUUID(),
            device_id: device.id,
            user_id: user.id,
            action: 'Face recognition',
            timestamp: new Date()
        }
        try {
            addHistory(history);
            sendEmail({
                to: user.email,
                subject: 'Door opened',
                html: `<h1>Door opened Using face recognition</h1>`
            })
        } catch (err) {
            return res.status(400).json({ message: "Device not connected", open: false });
        }

    } catch (err: unknown) {
        console.log(err);
    }

    res.status(200).json({ message: "Opened the door", open })
}

export const NFCbadgeController = async (req: Request, res: Response) => {

    let device: Device & {users: User[]} | null = null;

    try {
        device = await getDeviceWithUsers({ id: req.user.deviceId, name: '' });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' });
    }

    if (!device) return res.status(404).json({ message: 'Device not found' });

    const { badgeId } = req.body;

    const userBadge = device.users.find((user) => user.badgeId === badgeId);

    console.log(userBadge);
    

    if (!userBadge) return res.status(400).json({ message: "Wrong badge id", open: false });

    let history = {
        id: generateUUID(),
        device_id: device.id,
        user_id: userBadge.id,
        action: 'NFC Badge',
        timestamp: new Date()
    }
    try {
        addHistory(history);
        await sendEmail({
            to: userBadge.email,
            subject: 'Door opened',
            html: `<h1>Door opened Using a NFC Badge</h1>`
        })
    } catch (err:any) {
        console.log(err.response.body.errors);
        
        return res.status(400).json({ message: "Device not connected", open: false });
    }

    res.status(200).json({ message: "Opened the door", open: true })
}

export const getDeviceUsersDataController = async (req: Request, res: Response) => {  

    const device = {
        id: req.user.deviceId,
        name: ""
    }
    let foundDevice: Device & {users: User[]} | null;
    try {
        foundDevice = await getDeviceWithUsers(device);
        if (!foundDevice) return res.status(404).json({ message: 'Device not found' });
    }catch(err){
        return res.status(500).json({ message: 'Server Error' });
    }
    const data =await Promise.all(foundDevice.users.map(async user => {
        let image: string | null = "";
        try {
            image = await imageToBase64(`${process.env.BASE_PATH}/src/storage/images/${req.user.deviceId}/${user.id}.jpeg`);
        } catch (error) {
            console.log(error);
        }
        return {
            id: user.id,
            badgeId: user.badgeId,
            image
        }
    }));
    return res.status(200).json({ data });

}
