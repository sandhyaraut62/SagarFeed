const express = require("express");
const db = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const fallbackProducts = [
  {
    id: 1,
    category: "Layer Feed",
    name: "Layer Feed",
    stage: "Layers",
    description: "Balanced nutrition for consistent egg production and strong flock health.",
    price: 0,
    unit: "per bag",
    image_url: null,
    is_active: 1,
  },
  {
    id: 2,
    category: "Broiler Feed",
    name: "Broiler Feed",
    stage: "Broilers",
    description: "High-performance feed designed for rapid growth and efficient conversion.",
    price: 0,
    unit: "per bag",
    image_url: null,
    is_active: 1,
  },
  {
    id: 3,
    category: "Giriraj Feed",
    name: "Giriraj Feed",
    stage: "General",
    description: "Reliable feed for everyday livestock performance and nutrition support.",
    price: 0,
    unit: "per bag",
    image_url: null,
    is_active: 1,
  },
  {
    id: 4,
    category: "Cattle Feed",
    name: "Cattle Feed",
    stage: "Cattle",
    description: "Nutritious feed to support milk production and healthy growth.",
    price: 0,
    unit: "per bag",
    image_url: null,
    is_active: 1,
  },
];

const router = express.Router();

function withStockLabel(product) {
  return {
    ...product,
    stockLabel: product.stock_quantity <= product.low_stock_threshold ? "Low" : "High",
  };
}

function valueFrom(body, camelKey, snakeKey, fallback) {
  if (body[camelKey] !== undefined) return body[camelKey];
  if (body[snakeKey] !== undefined) return body[snakeKey];
  return fallback;
}

function toNullableString(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function toNumber(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function hasInvalidNumber(...numbers) {
  return numbers.some((number) => !Number.isFinite(number) || number < 0);
}

function sendFallbackProducts(res) {
  res.status(200).json({ products: fallbackProducts.map(withStockLabel) });
}

// GET /api/products — public product catalog (grouped implicitly by category field)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE is_active = 1 ORDER BY category, id"
    );
    res.status(200).json({ products: rows.map(withStockLabel) });
  } catch (err) {
    console.error("Product catalog query failed, serving fallback data:", err.message);
    sendFallbackProducts(res);
  }
});

// GET /api/products/admin/all — Admin: full catalog including inactive products
router.get("/admin/all", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY category, id");
    res.status(200).json({ products: rows.map(withStockLabel) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// GET /api/products/:id — single product detail
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ product: withStockLabel(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// POST /api/products — Admin: create a new product
router.post("/", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const {
      category,
      name,
      stage,
      description,
      image,
      imageUrl,
      price,
      unit,
      stockQuantity,
      stock_quantity,
      lowStockThreshold,
      low_stock_threshold,
      isActive,
      is_active,
    } = req.body;

    if (!category || !name || price === undefined || !unit) {
      return res
        .status(400)
        .json({ message: "Category, name, price and unit are required." });
    }

    const numericPrice = toNumber(price, NaN);
    const numericStock = toNumber(stockQuantity ?? stock_quantity, 0);
    const numericThreshold = toNumber(lowStockThreshold ?? low_stock_threshold, 50);
    if (hasInvalidNumber(numericPrice, numericStock, numericThreshold)) {
      return res.status(400).json({ message: "Price and stock values must be positive numbers." });
    }

    const [result] = await db.query(
      `INSERT INTO products
        (category, name, stage, description, image, image_url, price, unit, stock_quantity, low_stock_threshold, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(category).trim(),
        String(name).trim(),
        toNullableString(stage),
        toNullableString(description),
        image || "product-broiler.png",
        toNullableString(imageUrl),
        numericPrice,
        String(unit).trim(),
        numericStock,
        numericThreshold,
        valueFrom(req.body, "isActive", "is_active", isActive ?? is_active ?? true) ? 1 : 0,
      ]
    );

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Product created.", product: withStockLabel(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PUT /api/products/:id — Admin: update any product field
router.put("/:id", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const [existingRows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    const existing = existingRows[0];

    const category = valueFrom(req.body, "category", "category", existing.category);
    const name = valueFrom(req.body, "name", "name", existing.name);
    const stage = valueFrom(req.body, "stage", "stage", existing.stage);
    const description = valueFrom(req.body, "description", "description", existing.description);
    const image = valueFrom(req.body, "image", "image", existing.image);
    const imageUrl = valueFrom(req.body, "imageUrl", "image_url", existing.image_url);
    const price = valueFrom(req.body, "price", "price", existing.price);
    const unit = valueFrom(req.body, "unit", "unit", existing.unit);
    const stockQuantity = valueFrom(req.body, "stockQuantity", "stock_quantity", existing.stock_quantity);
    const lowStockThreshold = valueFrom(
      req.body,
      "lowStockThreshold",
      "low_stock_threshold",
      existing.low_stock_threshold
    );
    const isActive = valueFrom(req.body, "isActive", "is_active", existing.is_active);

    const numericPrice = toNumber(price, NaN);
    const numericStock = toNumber(stockQuantity, existing.stock_quantity);
    const numericThreshold = toNumber(lowStockThreshold, existing.low_stock_threshold);
    if (!category || !name || !unit || hasInvalidNumber(numericPrice, numericStock, numericThreshold)) {
      return res.status(400).json({ message: "Please provide valid product details." });
    }

    await db.query(
      `UPDATE products SET category = ?, name = ?, stage = ?, description = ?, image = ?,
        image_url = ?, price = ?, unit = ?, stock_quantity = ?, low_stock_threshold = ?, is_active = ?
       WHERE id = ?`,
      [
        String(category).trim(),
        String(name).trim(),
        toNullableString(stage),
        toNullableString(description),
        image || "product-broiler.png",
        toNullableString(imageUrl),
        numericPrice,
        String(unit).trim(),
        numericStock,
        numericThreshold,
        isActive ? 1 : 0,
        req.params.id,
      ]
    );

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Product updated.", product: withStockLabel(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// DELETE /api/products/:id — Admin: remove a product from the catalog
router.delete("/:id", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PATCH /api/products/:id/stock — Dealer/Admin update stock quantity (Inventory tab)
router.patch("/:id/stock", requireAuth, requireRole("Dealer", "Admin"), async (req, res) => {
  try {
    const { stock_quantity } = req.body;
    if (stock_quantity === undefined || Number(stock_quantity) < 0) {
      return res.status(400).json({ message: "Please provide a valid stock quantity." });
    }

    await db.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [
      stock_quantity,
      req.params.id,
    ]);

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Stock updated.", product: withStockLabel(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
