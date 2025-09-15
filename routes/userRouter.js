import exprress from "express";
import { createUser, loginUser } from "../controller/userController.js";

const userRouter = exprress.Router();
// Define user routes here
userRouter.post("/", createUser);

userRouter.get("/login", loginUser);

export default userRouter;
