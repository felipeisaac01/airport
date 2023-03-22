import { Router } from "express"
import { login } from "../controllers/AuthControllers"

const routes = Router()

routes.post("/airports", login)

export default routes