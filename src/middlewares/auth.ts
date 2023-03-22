import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IAuthTokenDto } from "../domain/dtos/controllers/auth";
import { UnauthorizedError } from "../errors/apiErrors";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if (!token) {
        throw new UnauthorizedError("Authorization header missing", "MW-01")
    }

    try {
        const decoded = verify(token, process.env.JWT_TOKEN ?? "/") as IAuthTokenDto;
        next();
    } catch (e) {
        throw new UnauthorizedError("Invalid token", "MW-02")
    }
}