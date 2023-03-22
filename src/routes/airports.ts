import { Router } from "express";
import { getAirports } from "../controllers/AirportControllers";

const routes = Router()

routes.get("/airports", getAirports)

export default routes