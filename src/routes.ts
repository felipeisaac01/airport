import { Router } from "express";
import { getAirports } from "./controllers/AirportControllers";

const routes = Router();

routes.use(getAirports)

export default routes