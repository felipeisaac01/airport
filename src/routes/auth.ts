import { Router } from "express"
import { login } from "../controllers/AuthControllers"

const routes = Router()

routes.post("/login", login)

export default routes