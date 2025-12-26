import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "Anonymous",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    
    images: {
      type: [String],
      default: [],
    },

    helpful: {
      type: Number,
      default: 0,
    },

    notHelpful: {
      type: Number,
      default: 0,
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
