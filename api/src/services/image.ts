import { Device } from "@prisma/client";
import fs from "fs/promises";
import { runCommand } from "../utils/runCommand";

export const saveImage = async (base64: string, path: string) => {
    const base64Data = base64.replace(/^data:image\/(?:jpeg|png|jpg);base64,/, "");
    try {
        await fs.writeFile(path, base64Data, 'base64');
    } catch (err: unknown) {
        console.log(err);
    }
}

export const getImageCode = async (path:string) => {
    const result = await runCommand(`python3 ${process.env.BASE_PATH}/src/utils/getFaceCode.py ${path}`);
    return result;
}

export const compareImages = async (receivedImagePath:string, savedImagePath:string) => {
    const result = await runCommand(`python3 ${process.env.BASE_PATH}/src/utils/faceRecognistion.py ${receivedImagePath} ${savedImagePath}`);
    const open = result.includes("True") ? true : false;
    return open;
}

export const findPhoneInImage = async (path:string) => {
    const result = await runCommand(`python3 ${process.env.BASE_PATH}/src/utils/findPhone.py ${path}`);
    const open = result.includes("True") ? true : false;
    return open;
}

export const  getUserImages = async (device:Device) => {
    const path = `${process.env.BASE_PATH}/src/storage/images/${device.id}`;
    return new Promise<string[]> (async (resolve, reject) => {
        try {
            const files = await fs.readdir(path);
            resolve(files);
        } catch (err: unknown) {
            console.log(err);
            reject(err);
        }
    });
}