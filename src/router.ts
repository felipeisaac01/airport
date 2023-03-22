require("express-async-errors");

import { Router } from "express";
import { authRoutes } from "./routes";
import { airportRoutes } from "./routes";

const routes = Router();

routes.use(airportRoutes);
routes.use(authRoutes);

export default routes