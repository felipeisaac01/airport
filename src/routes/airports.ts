import { Router } from "express";
import { getAirports } from "../controllers/AirportControllers";
import { authenticateBuyer } from "../middlewares/buyer";

const routes = Router()

routes.get("/airports", authenticateBuyer, getAirports)

export default routes