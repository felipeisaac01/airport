import { Router } from "express"
import { cancelFlight, createFlight, updateFlight } from "../controllers/FlightsControllers"
import { authenticateAdmin } from "../middlewares/admin"

const routes = Router()

routes.post("/flight", authenticateAdmin, createFlight)
routes.put("/flight", authenticateAdmin, updateFlight)
routes.put("/flight-cancel", authenticateAdmin, cancelFlight)

export default routes