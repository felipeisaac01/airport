import { Router } from "express"
import { createFlight, updateFlight } from "../controllers/FlightsControllers"
import { authenticate } from "../middlewares/auth"

const routes = Router()

routes.post("/flight", authenticate, createFlight)
routes.put("/flight", authenticate, updateFlight)

export default routes