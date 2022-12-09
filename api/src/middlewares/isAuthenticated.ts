import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/users';

export const isAuthenticated = async (req: Request & {user:User}, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Unauthenticated' });

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        
        const user = await findUserById(decoded.id as string);
        if(!user)
            return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}