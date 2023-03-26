import { Router } from "express"
import { cancelFlight, createFlight, getFlights, updateFlight } from "../controllers/FlightControllers"
import { authenticateAdmin } from "../middlewares/admin"

const routes = Router()

routes.post("/flight", authenticateAdmin, createFlight)
routes.put("/flight/:flightId", authenticateAdmin, updateFlight)
routes.put("/flight-cancel/:flightId", authenticateAdmin, cancelFlight)
routes.get("/flight", authenticateAdmin, getFlights)

export default routes