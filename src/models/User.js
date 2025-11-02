import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minLength: 6 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  studentCode: { type: String, trim: true }
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model("User", userSchema);
