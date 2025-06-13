import Doctor from "../models/doctorModel.js";

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
const doctorList=async(req,res)=>{

  try {
    const doctors =await Doctor.find({}).select(["-password","-email"]);
   res.json({success:true,doctors})
  } catch (error) {
      console.error(error.message);

    res.json({success:false,message:error.message})
  }
}

export {changeAvailability,doctorList}