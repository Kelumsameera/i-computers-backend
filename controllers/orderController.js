import Order from "../models/order.js";
import Product from "../models/product.js";
import Settings from "../models/Settings.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const latestOrder = await Order.findOne().sort({ date: -1 });

    let orderId = "ORD000001";
    if (latestOrder != null) {
      let latestOrderNumber = parseInt(
        latestOrder.orderId.replace("ORD", "")
      );
      orderId = "ORD" + (latestOrderNumber + 1).toString().padStart(6, "0");
    }

    const items = [];
    let total = 0;

    let hasFreeShippingProduct = false;

   
    for (let i = 0; i < req.body.items.length; i++) {
      const product = await Product.findOne({
        productID: req.body.items[i].productID,
      });

      if (!product) {
        return res.status(400).json({
          message: `Product with ID ${req.body.items[i].productID} not found`,
        });
      }

      if (product.freeShipping === true) {
        hasFreeShippingProduct = true;
      }

      items.push({
        productID: product.productID,
        name: product.name,
        price: product.price,
        quantity: req.body.items[i].quantity,
        image: product.images[0],
      });

      total += product.price * req.body.items[i].quantity;
    }

    let shippingFee = 0;
    let freeShippingApplied = false;

    const settings = await Settings.findOne();

    if (settings?.freeShippingEnabled) {
      if (
        hasFreeShippingProduct ||
        settings.freeShippingDistricts?.includes(req.body.district)
      ) {
        freeShippingApplied = true;
        shippingFee = 0;
      } else {
        shippingFee = settings.defaultShippingFee || 0;
      }
    } else {
      shippingFee = settings?.defaultShippingFee || 0;
    }

    total += shippingFee;

    
    let name = req.body.name;
    if (name == null) {
      name = req.user.firstName + " " + req.user.lastName;
    }

    const newOrder = new Order({
      orderId,
      email: req.user.email,
      name,
      address: req.body.address,
      district: req.body.district,
      total,
      shippingFee,
      freeShippingApplied,
      items,
      phone: req.body.phone,
    });

    await newOrder.save();

    return res.json({
      message: "Order placed successfully",
      orderId,
      freeShippingApplied,
      shippingFee,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Placing order",
      error: error.message,
    });
  }
}


//GET /api/orders
export async function getOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  if (isAdmin(req)) {
    const orders = await Order.find().sort({ date: -1 });

    res.json(orders);
  } else {
    const orders = await Order.find({ email: req.user.email }).sort({
      date: -1,
    });

    res.json(orders);
  }
}
export async function updateOrderStatus(req, res) {
  if (req.user == null || !isAdmin(req)) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const orderId = req.params.orderId;
    const status = req.body.status;
    const notes = req.body.notes;

    await Order.updateOne(
      { orderId: orderId },
      { status: status, notes: notes }
    );
    res.json({
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order status",
      error: error.message,
    });
  }
}

// GET /orders/top-selling
export async function getTopSelling(req, res) {
  try {
    const orders = await Order.find();

    const salesMap = {}; // productID → total quantity sold

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!salesMap[item.productID]) {
          salesMap[item.productID] = 0;
        }
        salesMap[item.productID] += item.quantity;
      });
    });

    // Convert to array
    const sorted = Object.entries(salesMap)
      .map(([productID, quantity]) => ({ productID, quantity }))
      .sort((a, b) => b.quantity - a.quantity) // DESC
      .slice(0, 6); // Top 6

    // Load product details
    const productIds = sorted.map((s) => s.productID);
    const products = await Product.find({ productID: { $in: productIds } });

    // Merge quantity with product details
    const result = sorted.map((entry) => ({
      ...entry,
      product: products.find((p) => p.productID === entry.productID),
    }));

    res.json({ success: true, topSelling: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to compute top selling products",
      error: err.message,
    });
  }
}
export async function previewOrder(req, res) {
  if (req.user == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { items, district } = req.body;

    let subtotal = 0;
    let hasFreeShippingProduct = false;

    for (let i = 0; i < items.length; i++) {
      const product = await Product.findOne({
        productID: items[i].productID,
      });

      if (!product) {
        return res.status(400).json({
          message: `Product with ID ${items[i].productID} not found`,
        });
      }

      if (product.freeShipping === true) {
        hasFreeShippingProduct = true;
      }

      subtotal += product.price * items[i].quantity;
    }

    const settings = await Settings.findOne();

    let shippingFee = 0;
    let freeShippingApplied = false;

    if (settings?.freeShippingEnabled) {
      if (
        hasFreeShippingProduct ||
        settings.freeShippingDistricts?.includes(district)
      ) {
        freeShippingApplied = true;
        shippingFee = 0;
      } else {
        shippingFee = settings.defaultShippingFee || 0;
      }
    } else {
      shippingFee = settings?.defaultShippingFee || 0;
    }

    return res.json({
      subtotal,
      shippingFee,
      freeShippingApplied,
      total: subtotal + shippingFee,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Preview failed",
      error: error.message,
    });
  }
}
