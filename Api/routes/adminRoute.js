import express from 'express'
import { addDoctor, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
// adminRouter.post(
//   "/",
//   upload.single("image"),
//   async (req, res) => {
//     console.log(req.file);
    
//     try {
//       if (!req.file) {

//         return res.status(400).json({ message: "Please provide an image" });
//       }
//       res.status(200).json(req.file)
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Server Error");
//     }
//   }
// );

export default adminRouter