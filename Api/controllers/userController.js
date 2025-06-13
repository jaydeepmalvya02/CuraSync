import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from 'validator'
import jwt from "jsonwebtoken";
import upload from "../middlewares/multer.js";
import {v2 as cloudinary} from 'cloudinary'
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

const login=async(req,res)=>{
  try {
      const {email,password}=req.body;
      const user=await User.findOne({email})
      if (!user) return res.json({success:false,message:'User does not exists'})
      const isMatch=await bcrypt.compare(password,user.password)
    console.log(isMatch);
    
    if(isMatch){
      CreatePayload(user,res)
    }
    else{
      res.json({ success: false, message: "Invalid Credentials!" });
    }
      
  } catch (error) { 
    console.error(error.message);
    res.json({success:false,message:error.message})
  }
}



//google api
const google = async (req, res) => {
  try {
    const { email, name } = req.body;
    // console.log(req.body);
    let user = await User.findOne({
      email,
    });
    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const username =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);

      user = new User({
        name,
        username,
        email,
        password: hashedPassword,
       
      });

      await user.save();
    }
    return CreatePayload(user, res);
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// API to Get user profile data
const getProfile=async(req,res)=>{
  console.log('id:',req.body);
  
  try {
  
    
    const {userId}=req.body
    console.log(userId);
    
    const userData=await User.findById(userId).select('-password')
    res.json({success:true,userData})
  } catch (error) {
    console.log(error.message);
    
    res.json({success:false,message:error.message})
  }
}
// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

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

export { register,login,google,getProfile,updateProfile };
