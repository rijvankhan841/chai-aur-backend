import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//Routes Import

import userRouter from "./routes/user.routes.js"

// Routes Declaration

// app.use("/users",userRouter);
app.use("/api/v1/users",userRouter)
console.log("User router added")
// http://localhost:8000/api/v1/users/register

export {app}


// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found bro!", url: req.originalUrl });
// });

