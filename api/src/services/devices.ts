import { Device, PrismaClient, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { sockets } from "../socketio/initSocket";
import { generateUUID } from "../utils/generateUUID";
import { sendEmail } from "./email";
import { addHistory } from "./history";
import { createUser } from "./users";

const prisma = new PrismaClient();

export const getAllDevices = async () => {
    const devices = await prisma.device.findMany();
    return devices;
}

export const getDeviceById = async (device:Device) => {
    const devices = await prisma.device.findFirst({
        where: {
            id: device.id
        }
    });
    return devices;
}

export const getDeviceWithUsers = async (device:Device) => {
    const devices = await prisma.device.findFirst({
        where: {
            id: device.id
        },
        include:{
            users: true
        }
    });
    return devices;
}

export const createDevice = async (device: Device) => {
    const newDevice = await prisma.device.create({
        data: device
    });

    let password = '12345678';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const deviceAdmin = await createUser({
        id: generateUUID(),
        fullname: `${device.name} Admin`,
        email: `admin@${device.name}.com`,
        phone: '0xxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 10).toString()),
        password: hashedPassword,
        status: "ADMIN",
        badgeId: generateUUID(),
        deviceId: device.id
    })

    return {newDevice, deviceAdmin:{...deviceAdmin, password}};
}

export const openDoor = async ({user,device,method}:{device: Device, user: User,method: string}) => {
    const socket = sockets.clients.get(device.id); 
    
    if(!socket) throw new Error('Device not connected');

    socket.emit('open_door',{message: 'Open door'});

    let history = {
        id: generateUUID(),
        device_id: device.id,
        user_id: user.id,
        action: method,
        timestamp: new Date()
    }

    const res = await new Promise<boolean>((resolve, reject) =>{

        setTimeout(() => {reject("Timeout exceeded")}, 5000);

        socket.on('door_opened', () => {
            addHistory(history);
            sendEmail({
                to: user.email,
                subject: 'Door opened',
                html: `<h1>Door opened Using your ${method==="Face" ? "facial detection": method==="Badge"? "NFC badge":"Manual"}</h1>`
            })
    
            resolve(true);
        });
    });   

    return res;
}