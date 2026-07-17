import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/auth", authRouter)

app.listen(port, () => {
    connectDb()
    console.log(`server started at ${port}`)
})

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from the backend!"
  });
});