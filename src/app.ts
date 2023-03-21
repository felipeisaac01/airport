import express from "express";
// import routes from "./routes"
import dotenv from "dotenv"
// import { errorHandler } from "./helpers/errorHandler";

dotenv.config()

const app = express()
app.use(express.json())
// app.use(routes)
// app.use(errorHandler)

export {app}