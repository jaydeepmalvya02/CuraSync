import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(token_decode.user._id);
    if (!req.body) {
      req.body = {};
    }

    req.body.userId = token_decode.user._id;


    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export default authUser;
