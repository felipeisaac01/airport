import { Router } from "express"
import { emitLuggageTicket } from "../controllers/LuggageControllers"

const routes = Router()

routes.get("/luggage/:ticketId/emit", emitLuggageTicket)

export default routes