const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, address, phone, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, address, phone, password });
    await user.save();

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"beni" <beni@gmail.com>',
      to: user.email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
    });

    user.verificationCode = verificationCode;
    await user.save();

    res
      .status(201)
      .json({ message: "User registered, verification email sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify Email
router.post("/verify/email", async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ verificationCode: code });
    if (!user) {
      return res.status(400).json({ message: "Invalid code" });
    }
    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationCode = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "User not verified" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
