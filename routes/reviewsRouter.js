import express from "express";
import {
  createReview,
  getAllReviews,
  voteReview,
  adminUpdateReview,
  adminToggleHidden,
  adminDeleteReview,
  adminRestoreReview,
  adminGetAllReviews
} from "../controllers/reviewController.js";

const reviewsRouter = express.Router();

// --- ADMIN ROUTES MUST COME FIRST ---
reviewsRouter.get("/all", adminGetAllReviews);
reviewsRouter.patch("/admin/:reviewId", adminUpdateReview);
reviewsRouter.patch("/admin/:reviewId/toggle-hidden", adminToggleHidden);
reviewsRouter.delete("/admin/:reviewId", adminDeleteReview);
reviewsRouter.patch("/admin/:reviewId/restore", adminRestoreReview);

// --- PUBLIC ROUTES ---
reviewsRouter.post("/add", createReview);
reviewsRouter.get("/:productId", getAllReviews);
reviewsRouter.patch("/:reviewId/vote", voteReview);

export default reviewsRouter;
