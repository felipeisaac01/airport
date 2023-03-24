import { sign } from "jsonwebtoken"

export async function generateAuthToken(payload: { userId: string, userPermission: "ADMIN" | "BUYER" }) {
    return sign(payload, process.env.JWT_SECRET ?? "/")
}