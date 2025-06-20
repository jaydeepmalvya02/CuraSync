// API for adding doctor
import doctorModel from "../models/doctorModel.js";
import { v2 as Cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from 'jsonwebtoken'
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log(req.file, req.body);
    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      res.status(404).json({ success: false, message: "Missing Details" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    // hasing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // upload image cloudinary
    const imageUpload = await Cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    const data = await newDoctor.save();
    res.json({success:true, message: "Doctor add" }, data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// AdminLogin
const loginAdmin=async(req,res)=>{
  try {
    const {email,password}=req.body
    if (email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({success:true,token})

    }
    else{
      res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}
// api to get all doctors list for admin panel
const allDoctors=async(req,res)=>{
  try {
    const doctors=await doctorModel.find({}).select('-password')
    if(!doctors) {
      return res.json({success:false,message:'Doctors Not Found'})
    }
    

    res.json({success:true,doctors})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// API to get all appointments list
const appointmentsAdmin=async(req,res)=>{
  try {
    const appointments=await Appointment.find({})
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// API for appointment cancellation

const appointmentCancel
 = async (req, res) => {
  try {
    const {  appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);
    
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
// API to get dashboard data for admin panel
const adminDashboard=async(req,res)=>{
  try {
    const doctors=await doctorModel.find({})
    const users=await User.find({})
    const appointments=await Appointment.find({})
    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}
// API to delete appointment
const deleteAppointment=async(req,res)=>{
  try {
    const {appointmentId}=req.body
    await Appointment.findByIdAndDelete(appointmentId)
    res.json({success:true,message:'Appointment Deleted'})
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}
// API to delete doctor by id
const deleteDoctor=async(req,res)=>{
  try {
    const docId=req.params.id
    console.log(docId);
    await doctorModel.findByIdAndDelete(docId)
    res.json({success:true,message:"Doctor Deleted from DataBase"})
    
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

export { addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,deleteAppointment,deleteDoctor };
