import express from "express";
import { createUser, getUser, googleLogin, loginUser, sendOtp, validateOTPAndUpdatePassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/send-otp/:email", sendOtp);
userRouter.post("/validate-otp", validateOTPAndUpdatePassword);

export default userRouter;
