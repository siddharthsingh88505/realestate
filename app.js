import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router } from "./routes/web.js";
import { connectDb } from "./db/connectDb.js";
// configuring dotenv
dotenv.config();

// initialize app
const app = express();

// static files
app.use(express.static('./frontend'));

// middlewares
// extented true allows to have nested valuse and false prvents this nested valuess
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// load routes
app.use("/", router);

// define template engine
app.set("view engine", "ejs");

// connecting database
connectDb(process.env.DATABASE_URL);

// Listening to browser port
app.listen(process.env.PORT, () => {
    console.log(`App is listening at http://localhost:${process.env.PORT}`);
})