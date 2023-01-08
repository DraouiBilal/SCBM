import { Device, PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { generateUUID } from "../utils/generateUUID";
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
        deviceId: device.id
    })

    return {newDevice, deviceAdmin};
}

