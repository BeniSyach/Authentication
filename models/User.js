const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String },
  facebookId: { type: String },
  createdAt: { type: Date, default: Date.now },
  emailVerifiedAt: { type: Date },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
