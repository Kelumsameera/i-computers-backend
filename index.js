import express from "express";
import mongoose from "mongoose";

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";

// Database connection mongoURI API_KEY
const mongoURI =
  "mongodb+srv://admin:1234@cluster0.ifdfckn.mongodb.net/sameera?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using mongoose
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB cluster");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Initialize express application
let app = express();

app.use(express.json());

// Custom middleware for JWT token verification
app.use((req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  if (authorizationHeader != null) {
    const token = authorizationHeader.replace("Bearer ", "");

    // Verify JWT token using secret key
    jwt.verify(token, "secretKey96$2025", (error, content) => {
      if (content == null) {
        // Token is invalid or expired → respond with 401 Unauthorized
        return res.status(401).json({
          message: "Invalid token",
        });
      } else {
        // Token is valid → attach decoded payload to req.user
        req.user = content;
        next();
      }
    });
  } else {
    // No Authorization header → skip verification
    next();
  }
});

// Routes
app.use("/users", userRouter);
app.use("/products", productRouter);

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
