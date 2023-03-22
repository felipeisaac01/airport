import { Router } from "express";
import { airportRoutes } from ".";
import { getAirports } from "../controllers/AirportControllers";

const routes = Router()

routes.use(airportRoutes);

export default routes