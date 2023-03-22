import { hash, compare } from "bcrypt"

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 10)
}

export async function comparePassword(givenPassword: string, encriptedPassword: string): Promise<Boolean> {
    return compare(givenPassword, encriptedPassword)
}