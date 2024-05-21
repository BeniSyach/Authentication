const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google OAuth
router.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  }
);

// Facebook OAuth
router.get(
  "/oauth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  }
);

module.exports = router;
