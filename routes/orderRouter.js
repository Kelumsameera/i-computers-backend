import express from "express";
import {
  createOrder,
  getOrders,
  getTopSelling,
  updateOrderStatus,
  previewOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/preview", previewOrder); 
orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/top-selling", getTopSelling);
orderRouter.put("/:orderId", updateOrderStatus);

export default orderRouter;
