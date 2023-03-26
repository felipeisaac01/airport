import { Router } from "express"
import { createFlightClass, updateFlightClass } from "../controllers/FlightClassControllers"
import { authenticateAdmin } from "../middlewares/admin"

const routes = Router()

routes.post("/flight-class", authenticateAdmin, createFlightClass)
routes.put("/flight-class", authenticateAdmin, updateFlightClass)

export default routes