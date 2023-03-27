import { Router } from "express"
import { cancelFlight, createFlight, getFlightPassengers, getFlights, updateFlight } from "../controllers/FlightControllers"
import { authenticateAdmin } from "../middlewares/admin"

const routes = Router()

routes.post("/flight", authenticateAdmin, createFlight)
routes.put("/flight/:flightId", authenticateAdmin, updateFlight)
routes.put("/flight/:flightId/cancel", authenticateAdmin, cancelFlight)
routes.get("/flight", authenticateAdmin, getFlights)
routes.get("/flight/:flightId/passengers", authenticateAdmin, getFlightPassengers)

export default routes