const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtSign = util.promisify(jwt.sign);

const signup = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return res.status(400).json({ message: "Password and passwordConfirm are required" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ status: "success", data: { user: newUser } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = await jwtSign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ status: "success", data: { token } });
};

module.exports = { signup, login };