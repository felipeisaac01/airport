import express from "express";
import routes from "./router"
import dotenv from "dotenv"
import { errorHandler } from "./errors/handler";

dotenv.config()

const app = express()
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export {app}