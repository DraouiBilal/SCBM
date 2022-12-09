import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssueCode, ZodSchema } from "zod";

export default (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err: unknown) {
            let errors: string[] = [];
            if (err instanceof ZodError) {
                errors = err.issues.map((issue) => {
                    switch (issue.code) {
                        case ZodIssueCode.invalid_type:
                            return `${issue.code}: ${issue.path.join('.')} must be a ${issue.expected}, but received ${issue.received}`;

                        case ZodIssueCode.too_small: 
                            return `${issue.code}: ${issue.path.join('.')} must be greater than ${issue.minimum}`;
                        
                        case ZodIssueCode.too_big:
                            return `${issue.code}: ${issue.path.join('.')} must be less than ${issue.maximum}`;

                        case ZodIssueCode.invalid_string:
                            return `${issue.code}: ${issue.path.join('.')} must be a valid ${issue.validation}`;

                        default:
                            return `${issue.code}: ${issue.path.join('.')}`;

                    }
                });
            }
            return res.status(400).json({ errors, message: 'Bad Request' });
        }
    }
}