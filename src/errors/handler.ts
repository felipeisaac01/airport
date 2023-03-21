import { NextFunction, Request, Response } from "express";
import "express-async-errors";
import { ApiError } from "./apiErrors";

export function errorHandler (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let error = err
    
    if (!(error instanceof ApiError)) {
        error = new ApiError(err.message, "XX-01", 500)
    }
   
    return res.status((err as ApiError).status).json(error);
}
