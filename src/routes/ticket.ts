import { Router } from "express"
import { cancelPurchase, emitTicket, getAvailableTicketsForPurchase, getBuyersTickets, purchaseTicket } from "../controllers/TicketController"
import { authenticateAdmin } from "../middlewares/admin"
import { authenticateBuyer } from "../middlewares/buyer"

const routes = Router()

routes.post("/ticket/:flightId", authenticateBuyer, purchaseTicket)
routes.get("/available-tickets", authenticateBuyer, getAvailableTicketsForPurchase)
routes.get("/ticket/:ticketId/emit", emitTicket)
routes.get("/buyer/:buyerId/tickets", authenticateAdmin, getBuyersTickets)
routes.put("/ticket/:ticketId/cancel", authenticateBuyer, cancelPurchase)

export default routes