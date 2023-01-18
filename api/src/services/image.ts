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
    const result = await runCommand(`python3 /usr/src/app/src/utils/getFaceCode.py ${path}`);
    console.log(result);
    return result;
}

export const compareImages = async (receivedImagePath:string, savedImagePath:string) => {
    const result = await runCommand(`python3 /usr/src/app/src/utils/faceRecognistion.py ${receivedImagePath} ${savedImagePath}`);
    const open = result.includes("True") ? true : false;
    return open;
}

export const findPhoneInImage = async (path:string) => {
    const result = await runCommand(`python3 /usr/src/app/src/utils/findPhone.py ${path}`);
    const open = result.includes("True") ? true : false;
    return open;
}