import { Request, Response } from "express";
import { IAuthTokenDto, ILoginRequestDto } from "../domain/dtos/controllers/auth";
import { NotFoundError, UnauthorizedError } from "../errors/apiErrors";
import { generateAuthToken } from "../helpers/auth";
import { bodyValidator } from "../helpers/bodyValidator";
import { comparePassword } from "../helpers/crypt";
import { repositories } from "../repositories";
import { loginBodySchema } from "../validator/auth";

export async function login(req: Request<{}, {}, ILoginRequestDto>, res: Response<IAuthTokenDto>) {
    bodyValidator(loginBodySchema, req.body, "AU")
    const { username, password } = req.body;

    const user = await repositories.admin.get(username);

    if (!user) {
        throw new NotFoundError("User not found", "AU-02")
    }

    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
        throw new UnauthorizedError("Invalid login", "AU-03")
    }

    const token = await generateAuthToken({ userId: user.id })

    return res.send({ token })
}