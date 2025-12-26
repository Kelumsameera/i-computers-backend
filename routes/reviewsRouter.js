import express from "express";
import {
  createReview,
  getAllReviews,
  voteReview,
  adminUpdateReview,
  adminToggleHidden,
  adminDeleteReview,
  adminRestoreReview,
  adminGetAllReviews,
  getProductRating,

} from "../controllers/reviewController.js";

const reviewsRouter = express.Router();

// admin routes
reviewsRouter.get("/all", adminGetAllReviews);
reviewsRouter.patch("/admin/:reviewId", adminUpdateReview);
reviewsRouter.patch("/admin/:reviewId/toggle-hidden", adminToggleHidden);
reviewsRouter.delete("/admin/:reviewId", adminDeleteReview);
reviewsRouter.patch("/admin/:reviewId/restore", adminRestoreReview);

reviewsRouter.get("/rating/:productId", getProductRating);
// public routes
reviewsRouter.post("/add", createReview);

// vote review
reviewsRouter.patch("/:reviewId/vote", voteReview);

reviewsRouter.get("/:productId", getAllReviews);

export default reviewsRouter;
