import { Router } from "express"
import { cancelFlight, createFlight, updateFlight } from "../controllers/FlightsControllers"
import { authenticate } from "../middlewares/auth"

const routes = Router()

routes.post("/flight", authenticate, createFlight)
routes.put("/flight", authenticate, updateFlight)
routes.put("/flight-cancel", authenticate, cancelFlight)

export default routes