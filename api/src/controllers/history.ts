import { Device } from '@prisma/client';
import {Request, Response} from 'express';
import { getDeviceById } from '../services/devices';
import { addHistory, getAllHistory } from '../services/history';
import { generateUUID } from '../utils/generators';

export const getAllHistoryController = async (req: Request, res: Response) => {
    let device:Device | null = {
        id: req.user.deviceId,
        name: '',
    }

    try {
        device = await getDeviceById(device);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }

    if(!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    try {
        const history = await getAllHistory(device);
        return res.status(200).json({histories:history});
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

export const addHistoryController = async (req: Request, res: Response) => {
    let device:Device | null = {
        id: req.params.id,
        name: '',
    }

    try {
        device = await getDeviceById(device);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }

    if(!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const {action} = req.body;
    const user = req.user;
    
    let history = {
        id: generateUUID(),
        device_id: device.id,
        user_id: user.id,
        action: action,
        timestamp: new Date()
    }
    console.log(history);
    
    try {
        history = await addHistory(history);
        return res.status(200).json({history});
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
