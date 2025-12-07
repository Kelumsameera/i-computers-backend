import Review from "../models/reviews.js";
import { isAdmin } from "./userController.js";

/* -------------------------------------------------------
   PUBLIC: CREATE NEW REVIEW
------------------------------------------------------- */
export async function createReview(req, res) {
  try {
    const { productId, name, rating, title, content, verified } = req.body;

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

/* -------------------------------------------------------
   PUBLIC: GET ALL REVIEWS FOR PRODUCT
------------------------------------------------------- */
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

/* -------------------------------------------------------
   PUBLIC: VOTE REVIEW (Helpful / Not Helpful)
------------------------------------------------------- */
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

/* -------------------------------------------------------
   ADMIN: GET ALL REVIEWS (including hidden & deleted)
------------------------------------------------------- */
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

/* -------------------------------------------------------
   ADMIN: UPDATE REVIEW CONTENT
------------------------------------------------------- */
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

/* -------------------------------------------------------
   ADMIN: HIDE / UNHIDE REVIEW
------------------------------------------------------- */
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

/* -------------------------------------------------------
   ADMIN: SOFT DELETE REVIEW
------------------------------------------------------- */
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

/* -------------------------------------------------------
   ADMIN: RESTORE DELETED REVIEW
------------------------------------------------------- */
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
