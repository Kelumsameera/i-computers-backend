import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

//CreateProduct handles the creation of a new product
export function createProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const product = new Product(req.body);

  product
    .save()
    .then(() => {
      res.json({
        message: "Product created successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error creating product",
        error: error.message,
      });
    });
}
//GET /api/products
export async function getAllProducts(req, res) {
  console.log("products fetching");
  try {
    if (isAdmin(req)) {
      // Product.find()
      // 	.then((products) => {
      // 		res.json(products);
      // 	})
      // 	.catch((error) => {
      // 		res.status(500).json({
      // 			message: "Error fetching products",
      // 			error: error.message,
      // 		});
      // 	});

      // Using async-await

      const products = await Product.find();
      console.log(products);
      res.json(products);
    } else {
      Product.find({ isAvailable: true })
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
      message: "Error fetching products",
      error: error,
    });
  }
}
//Delete /api/products/:productID
export function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Only admin can delete products",
    });
    return;
  }

  const productID = req.params.productID;

  Product.deleteOne({ productID: productID }).then(() => {
    res.json({
      message: "Product deleted successfully",
    });
  });
}
//Update /api/products/:productID
export function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Only admin can update products",
    });
    return;
  }

  const productID = req.params.productID;

  Product.updateOne({ productID: productID }, req.body).then(() => {
    res.json({
      message: "Product updated successfully",
    });
  });
}
//Getproduct by ID /api/products/:productID
export function getProductByID(req, res) {
  const productID = req.params.productID;

  Product.findOne({ productID: productID })
    .then((product) => {
      if (product == null) {
        res.status(404).json({
          message: "Product not found",
        });
      } else {
        if (product.isAvailable) {
          res.json(product);
        } else {
          if (isAdmin(req)) {
            res.json(product);
          } else {
            res.status(404).json({
              message: "Product not found",
            });
          }
        }
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching product",
        error: error.message,
      });
    });
}
//Search products /api/products/search/:query
export async function searchProducts(req, res) {
  const query = req.params.query;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { altNames: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
      isAvailable: true,
    });
    return res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error searching products",
      error: error.message,
    });
  }
}


// Bulk create products
export async function createProductsBulk(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Only admin can create products in bulk",
    });
  }

  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        message: "Invalid data format. Expected an array",
      });
    }

    await Product.insertMany(products);

    res.status(201).json({
      message: "Products created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating products",
      error: error.message,
    });
  }
}
