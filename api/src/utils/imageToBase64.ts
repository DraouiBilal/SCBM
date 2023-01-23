import fs from 'fs/promises';

export const imageToBase64 = async (path: string) => {
    if (!path) return null;
    
    // read binary data
    const bitmap = await fs.readFile(path);

    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

export default imageToBase64