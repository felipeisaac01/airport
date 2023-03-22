import "express-async-errors";
import {app} from "./app";
import { populateDatabase } from "./helpers/populateDatabase";

const port = process.env.PORT ?? "8000"

populateDatabase()

app.listen(parseInt(port), () => console.log(`Listening on port ${port}`))