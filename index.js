const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/oauth", require("./routes/oauth"));
app.use("/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
