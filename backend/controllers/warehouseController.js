const asyncHandler = require("express-async-handler");
const Warehouse = require("../models/warehouseModel");
const mongoose = require("mongoose");
const Product = require("../models/productModel");  // ✅ Import Missing Models
const Order = require("../models/orderModel"); 

// 📌 Add new warehouse (with stock items)
const addWarehouse = asyncHandler(async (req, res) => {
  try {
    const { name, location, capacity, stock = [] } = req.body;

    // Convert product IDs to ObjectId
    const formattedStock = stock.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product), // Ensure ObjectId
      quantity: item.quantity,
    }));

    const warehouse = new Warehouse({
      name,
      location,
      capacity,
      stock: formattedStock, // Store converted stock array
    });

    const savedWarehouse = await warehouse.save();
    res.status(201).json(savedWarehouse);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// 📌 Get all warehouses with populated stock details
const getStockItems = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().populate("stock.product", "name price category");
  console.log("📦 Warehouse Data Sent:", warehouses); // Debug log
  res.json(warehouses);
});

const getWarehouses = asyncHandler(async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);  // ✅ Ensure this is an array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch warehouses" });
  }
});

// 📌 Update stock quantity in a warehouse
const updateStockQuantity = asyncHandler(async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found." });
    }

    // Find the product in the stock array
    const stockItem = warehouse.stock.find(
      (item) => item.product.toString() === productId
    );

    if (!stockItem) {
      return res.status(404).json({ message: "Product not found in warehouse stock." });
    }

    // Update stock quantity
    stockItem.quantity = quantity;
    const updatedWarehouse = await warehouse.save();
    
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getWarehouseStats = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();  
    
    // Ensure proper response format
    const stats = {
      totalProducts: totalProducts || 0,
      lowStock: 0,
      pendingShipments: 0
    };

    // Get low stock count
    const lowStockResult = await Warehouse.aggregate([
      { $unwind: "$stock" },
      { $match: { "stock.quantity": { $lt: 10 } } },
      { $count: "lowStockCount" }
    ]);
    
    if (lowStockResult.length > 0) {
      stats.lowStock = lowStockResult[0].lowStockCount;
    }

    // Get pending shipments
    const pendingShipments = await Order.countDocuments({ 
      status: { $regex: /pending/i } 
    });
    stats.pendingShipments = pendingShipments || 0;

    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(stats);

  } catch (error) {
    console.error("🚨 Warehouse Stats Error:", error.message);
    // Ensure error response is JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      message: "Failed to fetch warehouse stats",
      error: error.message 
    });
  }
});


// 📌 Export functions
module.exports = {getWarehouseStats,getWarehouses, addWarehouse, getStockItems, updateStockQuantity };
