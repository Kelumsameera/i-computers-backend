import { requireAdmin } from "../middleware/requireAdmin.js";
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
reviewsRouter.get("/all", requireAdmin, adminGetAllReviews);
reviewsRouter.patch("/admin/:reviewId", requireAdmin, adminUpdateReview);
reviewsRouter.patch("/admin/:reviewId/toggle-hidden", requireAdmin, adminToggleHidden);
reviewsRouter.delete("/admin/:reviewId", requireAdmin, adminDeleteReview);
reviewsRouter.patch("/admin/:reviewId/restore", requireAdmin, adminRestoreReview);

reviewsRouter.get("/rating/:productId", getProductRating);
// public routes
reviewsRouter.post("/add", createReview);

// vote review
reviewsRouter.patch("/:reviewId/vote", voteReview);

reviewsRouter.get("/:productId", getAllReviews);

export default reviewsRouter;
