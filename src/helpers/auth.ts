import { sign } from "jsonwebtoken"

export async function generateAuthToken(payload: any) {
    return sign(payload, process.env.JWT_SECRET ?? "/")
}