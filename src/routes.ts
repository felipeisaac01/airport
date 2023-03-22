import { Router } from "express";
import { getAirports } from "./controllers/airports";

const routes = Router();

routes.get("/airports", getAirports);

export default routes