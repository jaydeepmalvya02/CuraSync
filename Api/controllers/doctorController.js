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


export {changeAvailability}