import { sign, verify } from "jsonwebtoken"
import { IAuthTokenDto } from "../domain/dtos/controllers/auth"

export async function generateAuthToken(payload: { userId: string, userPermission: "ADMIN" | "BUYER" }) {
    return sign(payload, process.env.JWT_SECRET ?? "/")
}

export async function getTokeninfo(token: string): Promise<IAuthTokenDto> {
    return verify(token, process.env.JWT_SECRET ?? "/") as IAuthTokenDto;
}