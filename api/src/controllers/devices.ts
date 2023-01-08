import { Device } from "@prisma/client";
import { Request, Response } from "express";
import { createDevice, getAllDevices, getDeviceById, getDeviceWithUsers } from "../services/devices";
import { addHistory } from "../services/history";
import { sockets } from "../socketio/initSocket";
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

export const getDeviceUsers = async (req: Request, res: Response) => {

    const device = {
        id: req.user.deviceId,
        name:""
    }

    try {
        const foundDevice = await getDeviceWithUsers(device);
        if(!foundDevice) return res.status(404).json({ message: 'Device not found' });
        return res.status(200).json({device: foundDevice});
    }catch(err) {
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

export const openDoorController = async (req: Request, res: Response) => {
    const id = req.user.deviceId;
    
    const socket = sockets.clients.get(id); 
    let device: Device | null;

    try {
        device = await getDeviceById({id, name: ''});
    } catch(err){
        return res.status(500).json({ message: 'Server Error' });
    }

    if(!device) return res.status(404).json({ message: 'Device not found' });
    if(!socket) return res.status(404).json({ message: 'Device not connected' });

    socket.emit('open_door',{message: 'Open door'});

    let history = {
        id: generateUUID(),
        device_id: device.id,
        user_id: req.user.id,
        action: "LOGIN_FACE_SUCCESS",
        timestamp: new Date()
    }

    console.log(history);

    try {
        await new Promise((resolve, reject) =>{

            setTimeout(() => {reject("Timeout exceeded")}, 5000);
    
            socket.on('door_opened', () => {
                addHistory(history);
                resolve(true);
            });
        });   
    } catch (err) {
        return res.status(500).json({ message: 'Door not opened' });
    }

    return res.status(200).json({ message: 'Door opened' });
}