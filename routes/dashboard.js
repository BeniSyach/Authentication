const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.get("/getData", protect, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email createdAt emailVerifiedAt")
      .lean();
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers, users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
