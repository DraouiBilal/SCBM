import { PrismaClient, History, Device } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllHistory = async (device:Device) => {

    const histories = await prisma.history.findMany({
        where: {
            device_id:  device.id
        },
        include: {
            device: true,
            user: true
        }
    });

    return histories.sort((a,b) => a.timestamp<b.timestamp ? 1 : -1);
}


export const addHistory = async (history:History) => {
    const newHistory = await prisma.history.create({
        data: history
    })
    return newHistory;
}