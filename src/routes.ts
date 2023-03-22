import { Router } from "express";
import airportRoutes from "./routes"
import authRoutes from "./routes";

const routes = Router();

routes.use(airportRoutes);
routes.use(authRoutes);

export default routes