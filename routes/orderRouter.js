import { requireAdmin } from "../middleware/requireAdmin.js";
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
orderRouter.get("/", requireAdmin, getOrders);
orderRouter.get("/top-selling", getTopSelling);
orderRouter.put("/:orderId", requireAdmin, updateOrderStatus);

export default orderRouter;
