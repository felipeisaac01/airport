require("express-async-errors");

import { Router } from "express";
import { 
    authRoutes, 
    flightClassRoutes,
    luggageRoutes, 
    ticketsRoutes
} from "./routes";
import { airportRoutes } from "./routes";
import { flightRoutes } from "./routes";

const routes = Router();

routes.use(airportRoutes);
routes.use(authRoutes);
routes.use(flightRoutes);
routes.use(ticketsRoutes);
routes.use(luggageRoutes);
routes.use(flightClassRoutes)

export default routes