import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IAuthTokenDto } from "../domain/dtos/controllers/auth";
import { UnauthorizedError } from "../errors/apiErrors";

export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization

    if (!token) {
        throw new UnauthorizedError("Authorization header missing", "AA-01")
    }

    let decoded: IAuthTokenDto;
    try {
        decoded = verify(token, process.env.JWT_TOKEN ?? "/") as IAuthTokenDto;
    } catch (e) {
        throw new UnauthorizedError("Invalid token", "AA-02")
    }

    if (decoded.userPermission !== "ADMIN") {
        throw new UnauthorizedError("Invalid permission.", "AA-03")
    }

    next();
}

