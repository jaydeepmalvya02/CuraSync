import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers["dtoken"] || req.headers["dToken"] || req.headers["authorization"];


    if (!dtoken) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    // console.log(token_decode.user._id);
    if (!req.body) {
      req.body = {};
    }

    req.body.docId = token_decode.id;


    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export default authDoctor;
