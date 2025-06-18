import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import upload from "../middlewares/multer.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
const CreatePayload = (user, res) => {
  const payload = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "40h" },
    (err, token) => {
      if (err) throw err;
      res.json({ success: true, user: payload.user, token });
    }
  );
};
// api to register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 6) {
      return res.json({ success: false, message: "Enter a strong password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword };
    let user = await User.findOne({ email });
    if (user)
      return res.json({ success: false, message: "User Already Exists!" });
    user = new User(userData);
    await user.save();
    return CreatePayload(user, res);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//  login api

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User does not exists" });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      CreatePayload(user, res);
    } else {
      res.json({ success: false, message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

//google api
const google = async (req, res) => {
  try {
    const { name, email, image } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Missing name or email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        image, // optional if schema supports it
      });
      await user.save();
    }

    // Use CreatePayload for token + response
    return CreatePayload(user, res);
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// API to Get user profile data
const getProfile = async (req, res) => {
  console.log("id:", req.body);

  try {
    const { userId } = req.body;
    console.log(userId);

    const userData = await User.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, message: error.message });
  }
};
// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    console.log(req.body);
    console.log(req.file);

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const parsedAddress =
      typeof address === "string" ? JSON.parse(address) : address;

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: parsedAddress,
    };

    // If image exists, upload to Cloudinary
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await User.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to book Appointment with video call generation

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    // Check if the slot is already booked
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await User.findById(userId).select("-password");
    delete docData.slots_booked;

    // Generate unique Jitsi room
    const jitsiRoom = `cura-sync-${crypto.randomBytes(6).toString("hex")}`;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
      jitsiRoom, // ✅ add this field
      payment: false, // default until paid
      isCompleted: false,
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default bookAppointment;

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await Appointment.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);
    // verify appointment user
    if (appointmentData.userId !== userId)
      return res.json({ success: false, message: "Unauthorized action" });
    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
// if using ES module
// const Razorpay = require("razorpay"); // if using CommonJS

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    const options = {
      amount: appointmentData.amount * 100, // amount in paise
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    console.log(req.body);

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo);
    if (orderInfo.status === "paid") {
      await Appointment.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Payment Successfull" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("Razorpay Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
// API to get Appointment by id
const getAppointment = async (req, res) => {
  try {
    const appointmentId  = req.params.id;
    const appointmentData = await Appointment.findById(appointmentId);
    res.json({ success: true, appointmentData });
  } catch (error) {
    console.error("Razorpay Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
export {
  register,
  login,
  google,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  getAppointment
};
