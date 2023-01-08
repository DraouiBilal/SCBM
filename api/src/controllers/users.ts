import { User } from "@prisma/client";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { createUser, deleteUser, findUserById, findUserByEmail, updateUser } from '../services/users';
import { generateUUID } from "../utils/generateUUID";

export const getUserController = async (req: Request, res: Response) => {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    res.json({user:req.user});
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
    const { fullname, email, phone, password, status } = req.body;

    const { deviceId } = req.user;
    console.log(deviceId);
    

    const id = generateUUID();
    let user: User | null = null;
    let hashedPassword: string = '';
    try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        user = await createUser({ id, fullname, email, phone, password: hashedPassword, status, deviceId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ user });
}

export const updateUserController = async (req: Request, res: Response) => {
    const { fullname, email, phone, password } = req.body;

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
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        user = await updateUser({ id, fullname, email, phone, password: hashedPassword, status: user.status, deviceId: user.deviceId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.json({ user });
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
