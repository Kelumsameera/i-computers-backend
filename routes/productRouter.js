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
productRouter.post("/", createProduct);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productID", getProductByID);
productRouter.delete("/:productID", deleteProduct);
productRouter.put("/:productID", updateProduct);

export default productRouter;
