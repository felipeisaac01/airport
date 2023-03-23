import { Router } from "express"
import { createFlight } from "../controllers/FlightsControllers"
import { authenticate } from "../middlewares/auth"

const routes = Router()

routes.post("/flight", authenticate, createFlight)

export default routes