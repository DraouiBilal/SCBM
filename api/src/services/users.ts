import { Device, PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient();

export async function findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: {
            id
        }

    });
    return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    return user;
}


export const createUser = async (user: User) => {
    const createdUser = await prisma.user.create({
        data: user
    })

    return createdUser;
}

export const updateUser = async (user: User) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: user
    })

    return updatedUser;
}

export const deleteUser = async (user: User) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: user.id
        }
    })

    return deletedUser;
}

export const getUserImages = async (device: Device) => {
    const images = await prisma.user.findMany({
        where: {
            deviceId: device.id
        },
        select: {
            image: true
        }
    });

    return images;
}