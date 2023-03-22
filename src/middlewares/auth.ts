import { NextFunction, Request } from "express";
import { verify } from "jsonwebtoken";
import { IAuthTokenDto } from "../domain/dtos/controllers/auth";
import { UnauthorizedError } from "../errors/apiErrors";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        throw new UnauthorizedError("Authorization header missing", "MW-01")
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, process.env.JWT_TOKEN ?? "/") as IAuthTokenDto;
        next();
    } catch (e) {
        throw new UnauthorizedError("Invalid token", "MW-02")
    }
}