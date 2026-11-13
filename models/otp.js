import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true 
     },
     otp:{
        type: String,
        required: true,
     },
     expiresAt: {
        type: Date,
        required: true,
     },
     attempts: {
        type: Number,
        default: 0,
     },
  });
// MongoDB TTL cleanup may be delayed; requests also check expiresAt explicitly.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
    
