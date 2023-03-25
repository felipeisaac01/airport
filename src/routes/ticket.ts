import { Router } from "express"
import { getAvailableTicketsForPurchase, purchaseTicket } from "../controllers/TicketController"
import { authenticateBuyer } from "../middlewares/buyer"

const routes = Router()

routes.post("/ticket", authenticateBuyer, purchaseTicket)
routes.get("/available-tickets", authenticateBuyer, getAvailableTicketsForPurchase)

export default routes