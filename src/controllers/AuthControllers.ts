import { Request, Response } from "express";
import { ILoginRequestDto } from "../domain/dtos/controllers/auth";
import { repositories } from "../repositories";

export async function login(req: Request<{}, {}, ILoginRequestDto>, res: Response) {
    const { user, password } = req.body;

    const userInDB = await repositories.admin.get(user);

    return res.send(userInDB)
}