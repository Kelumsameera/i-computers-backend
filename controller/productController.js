import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

// Create Product
export async function createProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const product = new Product(req.body);
    await product
      .save()
      .then(() => {
        res.json({ message: "Product created successfully" });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error creating product",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error creating product",
      error: error.message,
    });
  }
}

// Get All Products
export async function getAllProducts(req, res) {
  try {
    if (isAdmin(req)) {
      // Admin → all products
      await Product.find()
        .then((products) => {
          res.json(products);
        })
        .catch((error) => {
          res.status(500).json({
            message: "Error fetching products",
            error: error.message,
          });
        });
    } else {
      // Non-admin → only available products
      await Product.find({ isAvailable: true })
        .then((products) => {
          res.json(products);
        })
        .catch((error) => {
          res.status(500).json({
            message: "Error fetching products",
            error: error.message,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error fetching products",
      error: error.message,
    });
  }
}

// Delete Product
export async function deleteProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ message: "Only admin can delete product" });
      return;
    }

    const productID = req.params.productID;
    await Product.deleteOne({ productID: productID })
      .then(() => {
        res.json({ message: "Product deleted successfully" });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error deleting product",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error deleting product",
      error: error.message,
    });
  }
}

// Update Product
export async function updateProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      res.status(403).json({ message: "Only admin can update product" });
      return;
    }

    const productID = req.params.productID;
    await Product.updateOne({ productID: productID }, req.body)
      .then(() => {
        res.json({ message: "Product updated successfully" });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error updating product",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error updating product",
      error: error.message,
    });
  }
}

// Get Product by ID
export async function getProductByID(req, res) {
  try {
    const productID = req.params.productID;
    await Product.findOne({ productID: productID })
      .then((product) => {
        if (!product) {
          res.status(404).json({ message: "Product not found" });
        } else {
          res.json(product);
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error fetching product",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Unexpected error fetching product",
      error: error.message,
    });
  }
}
