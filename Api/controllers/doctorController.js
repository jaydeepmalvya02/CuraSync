import doctorModel from "../models/doctorModel.js";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Appointment from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await Doctor.findById(docId);
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// Api for Doctors list in Client
const doctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// APi to get doctor appointment for doctor panel
const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    console.log(docId, req.body);

    const appointments = await Appointment.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to mark appoint  as a completed

const appointmentComplete = async (req, res) => {
  console.log(req.body);
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Marked Failed" });
    }
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await Appointment.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to grt doctot profile for Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, doctor });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to update doctor profile data from docotr Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    console.log(fees);

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API for delete appointment from docotr panel
const deleteDoctorAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndDelete(appointmentId);
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  deleteDoctorAppointment
};
