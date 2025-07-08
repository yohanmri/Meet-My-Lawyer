import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET); //decode the token

    // Fix: Initialize req.body if it doesn't exist before setting userId
    req.body = req.body || {};
    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
