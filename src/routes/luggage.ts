import { Router } from "express"
import { emitLuggageTicket } from "../controllers/LuggageControllers"

const routes = Router()

routes.get("/emit-luggage-ticket/:ticketId", emitLuggageTicket)

export default routes