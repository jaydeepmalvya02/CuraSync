import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  google,
  listAppointment,
  login,
  paymentRazorpay,
  register,
  updateProfile,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/google", google);
userRouter.get("/profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments",authUser,listAppointment)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)
userRouter.post("/payment-razorpay",authUser,paymentRazorpay)
userRouter.post("/verifyRazorpay",authUser,verifyRazorpay)
export default userRouter;
