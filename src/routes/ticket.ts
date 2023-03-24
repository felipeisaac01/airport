import { Router } from "express"
import { purchaseTicket } from "../controllers/TicketController"
import { authenticateBuyer } from "../middlewares/buyer"

const routes = Router()

routes.post("/ticket", authenticateBuyer, purchaseTicket)

export default routes