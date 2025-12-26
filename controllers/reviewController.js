import Review from "../models/reviews.js";
import { isAdmin } from "./userController.js";

// CreateReview handles the creation of a new review
export async function createReview(req, res) {
  try {
    const { productId, name, rating, title, content, verified, images } =
      req.body;

    if (!productId || !rating || !title || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = new Review({
      productId,
      name: name || "Anonymous",
      rating,
      title,
      content,
      verified: verified ?? false,
      images: Array.isArray(images) ? images : [], 
    });

    const saved = await review.save();

    res.json({
      success: true,
      message: "Review created successfully",
      review: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: err.message,
    });
  }
}


// GetAllReviews fetches all non-hidden, non-deleted reviews for a product
export async function getAllReviews(req, res) {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      productId,
      hidden: false,
      deleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: err.message,
    });
  }
}

// VoteReview allows users to vote a review as helpful or not helpful
export async function voteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { type } = req.body;

    if (!["helpful", "notHelpful"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (type === "helpful") {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: "Vote recorded successfully",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error recording vote",
      error: err.message,
    });
  }
}

// Admin Get All Reviews
export async function adminGetAllReviews(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin reviews",
      error: err.message,
    });
  }
}
// Admin Update Review
export async function adminUpdateReview(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { reviewId } = req.params;
    const { title, content, rating } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (title !== undefined) review.title = title;
    if (content !== undefined) review.content = content;
    if (rating !== undefined) review.rating = rating;

    await review.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: err.message,
    });
  }
}

// Admin Toggle Hidden State of Review
export async function adminToggleHidden(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { reviewId } = req.params;
    const { hidden } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.hidden = Boolean(hidden);
    await review.save();

    res.json({
      success: true,
      message: hidden ? "Review hidden" : "Review unhidden",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating hidden state",
      error: err.message,
    });
  }
}

// Admin Toggle Hidden State of Review
export async function adminDeleteReview(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.deleted = true;
    await review.save();

    res.json({
      success: true,
      message: "Review soft-deleted",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: err.message,
    });
  }
}

// Admin Restore Review
export async function adminRestoreReview(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.deleted = false;
    await review.save();

    res.json({
      success: true,
      message: "Review restored successfully",
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error restoring review",
      error: err.message,
    });
  }
}
// ⭐ Get rating summary for a product
export async function getProductRating(req, res) {
  try {
    const { productId } = req.params;

    const result = await Review.aggregate([
      {
        $match: {
          productId: productId,
          hidden: false,
          deleted: false,
        },
      },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({
        averageRating: 0,
        reviewCount: 0,
      });
    }

    res.json({
      averageRating: Number(result[0].averageRating.toFixed(1)),
      reviewCount: result[0].reviewCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get rating",
      error: error.message,
    });
  }
}
