import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },

    name: { type: String, default: "Anonymous" },

    rating: { type: Number, required: true, min: 1, max: 5 },

    verified: { type: Boolean, default: false },

    title: { type: String, required: true },

    content: { type: String, required: true },

    helpful: { type: Number, default: 0 },

    notHelpful: { type: Number, default: 0 },

    // ⭐ Admin moderation fields
    hidden: { type: Boolean, default: false },  // admin hide/unhide
    deleted: { type: Boolean, default: false }, // soft delete
  },

  // ⭐ Automatically adds createdAt & updatedAt
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
