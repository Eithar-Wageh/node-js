const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../models/users");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const { userId } = await jwtVerify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;