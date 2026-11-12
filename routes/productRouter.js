import { requireAdmin } from "../middleware/requireAdmin.js";
import express from "express";
import {
  createProduct,
  createProductsBulk,
  deleteProduct,
  getAllProducts,
  getProductByID,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();
// get all products
productRouter.get("/", getAllProducts);
// get trending products
productRouter.get("/trending", (req, res) => {
  res.json({ message: "Trending products" });
});
productRouter.post("/", requireAdmin, createProduct);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productID", getProductByID);
productRouter.delete("/:productID", requireAdmin, deleteProduct);
productRouter.put("/:productID", requireAdmin, updateProduct);

export default productRouter;
