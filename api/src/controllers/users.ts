import { Device, User } from "@prisma/client";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { createUser, deleteUser, findUserById, findUserByEmail, updateUser } from '../services/users';
import { getDeviceById } from '../services/devices';
import { generateRandomString, generateUUID } from "../utils/generators";
import { imageToBase64 } from "../utils/imageToBase64";
import fs from 'fs'
import { saveImage } from "../services/image";
import { sendEmail } from "../services/email";

export const getUserController = async (req: Request, res: Response) => {
    const path = `${process.env.BASE_PATH}/src/storage/images/${req.user.deviceId}/${req.user.id}.jpeg`;
    let base64: string | null = "";
    try {
        base64 = await imageToBase64(path);
    } catch (error) {
        console.error(error);
    }
    res.json({ user: { ...req.user, image: `data:image/jpeg;base64,${base64}` } });
}

export const loginUser = async (req: Request, res: Response) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user)
        return res.status(404).json({ message: 'User not found' });


    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({ user, token });
}

export const createUserController = async (req: Request, res: Response) => {
    const { fullname, email, phone, status } = req.body;
    let { password } = req.body
    let createdPassword = false;
    const { deviceId } = req.user;

    if (!password) {
        password = generateRandomString(16);
        createdPassword = true;
    }

    const id = generateUUID();
    let user: User | null = null;
    let hashedPassword: string = '';
    try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        user = await createUser({ id, fullname, email, phone, password: hashedPassword, status, deviceId, badgeId: generateRandomString(8) });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        sendEmail({
            to: user.email,
            subject: 'Account creation',
            html: `
                <h1> Account created </h1>
                <p> Here are the credentials that should be used to access your account </p>
                <ul>
                    <li>Email: ${user.email}</li>
                    <li>Password: ${user.password} </li>
                </ul>
            `
        })
    } catch (error: any) {
        console.log(error.response.body.errors);
    }
    res.json({ user });
}

export const updateUserController = async (req: Request, res: Response) => {

    const { fullname, email, phone, password, image, badgeId } = req.body;

    const id = req.user.id;
    let user: User | null = null;
    let hashedPassword: string = '';

    try {
        user = await findUserById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user)
        return res.status(404).json({ message: 'User not found' });
    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        else {
            hashedPassword = user.password;
        }
        user = await updateUser({ id, fullname, email, phone, password: hashedPassword, status: user.status, deviceId: user.deviceId, badgeId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.json({ user });
}

export const updateUserImageController = async (req: Request, res: Response) => {

    let device: Device | null = { id: req.user.deviceId, name: '' };

    try {
        device = await getDeviceById(device);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!device)
        return res.status(404).json({ message: 'Device not found' });

    if (!fs.existsSync(process.env.BASE_PATH+'/src/storage/images/' + req.user.deviceId))
        fs.mkdirSync(process.env.BASE_PATH+'/src/storage/images/' + req.user.deviceId);

    const { image } = req.body;

    const path = `${process.env.BASE_PATH}/src/storage/images/${req.user.deviceId}/${req.user.id}.jpeg`;

    try {
        await saveImage(image, path);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ user: { ...req.user, image } });
}

export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    let user: User | null = null;

    try {
        user = await findUserById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user)
        return res.status(404).json({ message: 'User not found' });

    try {
        await deleteUser(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.json({ message: 'User deleted' });
}