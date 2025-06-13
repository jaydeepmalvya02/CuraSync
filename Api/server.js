import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
// app config

const app = express();
const port = process.env.PORT || 7000;
connectDB()
connectCloudinary()
// middlewares

app.use(express.json());

app.use(cors());

// admin api endpoints
app.use("/api/admin", adminRouter);
// doctor api endpoints
app.use("/api/doctor",doctorRouter)
// user endpoints
app.use('/api/user',userRouter)
app.get("/", (req, res) => {
  res.send("API WORKING");
});
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
