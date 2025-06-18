import express from "express";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentDoctor,
  deleteDoctorAppointment,
  doctorDashboard,
  doctorList,
  doctorProfile,
  getAppointment,
  loginDoctor,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, appointmentDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.get("/video-call", authDoctor, getAppointment);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post(
  "/delete-doctor-appointment",
  authDoctor,
  deleteDoctorAppointment
);

export default doctorRouter;
