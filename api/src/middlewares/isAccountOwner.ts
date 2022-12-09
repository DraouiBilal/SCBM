import { NextFunction, Request, Response } from "express";

export const isAccountOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if(id!==req.user.id)
        return res.status(401).json({ message: 'Unauthorized' });

    next();
}