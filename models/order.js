import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    /* ✅ NEW — District for Sri Lanka shipping logic */
    district: {
      type: String,
      required: false,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    /*  FINAL order total (products + shipping) */
    total: {
      type: Number,
      required: true,
    },

    /* NEW — shipping fee */
    shippingFee: {
      type: Number,
      default: 0,
    },

    /* NEW — whether free shipping was applied */
    freeShippingApplied: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      required: true,
      default: "pending",
    },

    phone: {
      type: String,
      required: false,
    },

    notes: {
      type: String,
      required: false,
    },

    items: [
      {
        productID: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // optional but recommended
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
