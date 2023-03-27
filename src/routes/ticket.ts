import { Router } from "express"
import { emitTicket, getAvailableTicketsForPurchase, purchaseTicket } from "../controllers/TicketController"
import { authenticateBuyer } from "../middlewares/buyer"

const routes = Router()

routes.post("/ticket/:flightId", authenticateBuyer, purchaseTicket)
routes.get("/available-tickets", authenticateBuyer, getAvailableTicketsForPurchase)
routes.get("/ticket/:ticketId/emit", emitTicket)

export default routes