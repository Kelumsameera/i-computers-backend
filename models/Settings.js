import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    freeShippingEnabled: {
      type: Boolean,
      default: false,
    },

    freeShippingDistricts: {
      type: [String], // ["Colombo", "Gampaha"]
      default: [],
    },

    freeShippingProductIds: {
      type: [String], // productID array
      default: [],
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
