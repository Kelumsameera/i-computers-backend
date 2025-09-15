import express from "express";
import mongoose from "mongoose";

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
const mongoURI =
  "mongodb+srv://admin:1234@cluster0.ifdfckn.mongodb.net/sameera?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB cluster");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

let app = express();

app.use(express.json());
app.use((req, res, next) => {
  const authorizationHeader = req.header("Authorization");
  if (authorizationHeader != null) {
    const token = authorizationHeader.replace("Bearer ", "");

    // console.log(token);
    jwt.verify(token, "secretKey96$2025", (error, content) => {
      if (content == null) {
        // console.log("invalid token");
        res.json({
          message: "invalid token",
        });
      } else {
        // console.log(content);
        req.user = content;
        next();
      }
    });
  } else {
    next();
  }
});

app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
