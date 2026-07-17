const express = require("express");
const db = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { notifyUser } = require("../utils/notify");

const router = express.Router();

// POST /api/orders — place an order from the cart (checkout)
// body: { items: [{ productId, quantity }], address: {...} OR addressId, paymentMethod: 'esewa' | 'cod' }
router.post("/", requireAuth, async (req, res) => {
  const { items, address, addressId, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }
  if (!["esewa", "cod"].includes(paymentMethod)) {
    return res.status(400).json({ message: "Please choose a valid payment method." });
  }
  if (!address && !addressId) {
    return res.status(400).json({ message: "Please provide a delivery address." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Resolve / save the address
    let resolvedAddressId = addressId || null;
    if (address && !addressId) {
      const { fullName, phone, addressLine, city, district, landmark } = address;
      if (!fullName || !phone || !addressLine || !city) {
        await connection.rollback();
        return res.status(400).json({ message: "Please fill in all required address fields." });
      }
      const [addrResult] = await connection.query(
        `INSERT INTO addresses (user_id, full_name, phone, address_line, city, district, landmark, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [req.user.id, fullName, phone, addressLine, city, district || null, landmark || null]
      );
      resolvedAddressId = addrResult.insertId;
    }

    // Validate products & stock, compute totals
    let totalAmount = 0;
    const orderItemsData = [];
    for (const item of items) {
      const [rows] = await connection.query("SELECT * FROM products WHERE id = ? FOR UPDATE", [
        item.productId,
      ]);
      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `Product #${item.productId} was not found.` });
      }
      const product = rows[0];
      const quantity = Number(item.quantity) || 1;

      if (!product.is_active) {
        await connection.rollback();
        return res.status(400).json({
          message: `${product.name} is not available for ordering right now.`,
        });
      }

      if (product.stock_quantity < quantity) {
        await connection.rollback();
        return res.status(400).json({
          message: `${product.name} only has ${product.stock_quantity} ${product.unit}(s) left in stock.`,
        });
      }

      const subtotal = Number(product.price) * quantity;
      totalAmount += subtotal;
      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        subtotal,
      });
    }

    const paymentStatus = paymentMethod === "esewa" ? "pending" : "cod_pending";

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, address_id, payment_method, payment_status, order_status, total_amount)
       VALUES (?, ?, ?, ?, 'placed', ?)`,
      [req.user.id, resolvedAddressId, paymentMethod, paymentStatus, totalAmount]
    );
    const orderId = orderResult.insertId;

    for (const item of orderItemsData) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.unitPrice, item.quantity, item.subtotal]
      );
      await connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [
        item.quantity,
        item.productId,
      ]);
    }

    await connection.commit();

    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: orderId,
        totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus: "placed",
        items: orderItemsData,
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Something went wrong while placing your order." });
  } finally {
    connection.release();
  }
});

// GET /api/orders/my — logged-in user's own order history
router.get("/my", requireAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, a.full_name AS address_name, a.phone AS address_phone, a.address_line,
              a.city, a.district, a.landmark
       FROM orders o
       LEFT JOIN addresses a ON a.id = o.address_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
      order.items = items;
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// GET /api/orders — Dealer/Admin: view all orders in the system (with customer name)
// If the logged-in Dealer has a service_area (district) assigned by Admin, only orders
// delivering to that district are shown. Admins always see everything, and Dealers with
// no service_area assigned also see everything (sensible default for a single-dealer setup).
router.get("/", requireAuth, requireRole("Dealer", "Admin"), async (req, res) => {
  try {
    let serviceArea = null;
    if (req.user.role === "Dealer") {
      const [[dealer]] = await db.query("SELECT service_area FROM users WHERE id = ?", [
        req.user.id,
      ]);
      serviceArea = dealer?.service_area || null;
    }

    const params = [];
    let query = `SELECT o.*, u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
              a.address_line, a.city, a.district, a.landmark
       FROM orders o
       JOIN users u ON u.id = o.user_id
       LEFT JOIN addresses a ON a.id = o.address_id`;

    if (serviceArea) {
      query += " WHERE a.district = ?";
      params.push(serviceArea);
    }
    query += " ORDER BY o.created_at DESC";

    const [orders] = await db.query(query, params);

    for (const order of orders) {
      const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
      order.items = items;
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PATCH /api/orders/:id/status — Dealer/Admin update order status (Deliveries tab)
router.patch("/:id/status", requireAuth, requireRole("Dealer", "Admin"), async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ["placed", "processing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Please provide a valid order status." });
    }

    const [[order]] = await db.query("SELECT user_id FROM orders WHERE id = ?", [req.params.id]);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    await db.query("UPDATE orders SET order_status = ? WHERE id = ?", [orderStatus, req.params.id]);

    const STATUS_MESSAGES = {
      placed: "has been placed",
      processing: "is now being processed",
      out_for_delivery: "is out for delivery",
      delivered: "has been delivered",
      cancelled: "was cancelled by Sagar Feeds",
    };
    await notifyUser(
      order.user_id,
      `Order #${req.params.id} ${STATUS_MESSAGES[orderStatus] || "status was updated"}.`,
      req.params.id
    );

    res.status(200).json({ message: "Order status updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PATCH /api/orders/:id/cancel — the customer who placed the order can cancel it
// themselves, as long as a Dealer hasn't already moved it past "processing".
router.patch("/:id/cancel", requireAuth, async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[order]] = await connection.query("SELECT * FROM orders WHERE id = ? FOR UPDATE", [
      req.params.id,
    ]);
    if (!order) {
      await connection.rollback();
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.user_id !== req.user.id && req.user.role !== "Admin") {
      await connection.rollback();
      return res.status(403).json({ message: "You can only cancel your own orders." });
    }
    if (!["placed", "processing"].includes(order.order_status)) {
      await connection.rollback();
      return res.status(400).json({
        message: "This order can no longer be cancelled — it's already out for delivery or delivered.",
      });
    }

    // Restock every item from this order
    const [items] = await connection.query("SELECT * FROM order_items WHERE order_id = ?", [
      req.params.id,
    ]);
    for (const item of items) {
      if (item.product_id) {
        await connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [
          item.quantity,
          item.product_id,
        ]);
      }
    }

    await connection.query("UPDATE orders SET order_status = 'cancelled' WHERE id = ?", [
      req.params.id,
    ]);

    if (order.payment_method === "esewa" && order.payment_status === "paid") {
      // Automatic eSewa refunds require a separate merchant refund request outside
      // this app — flag it so an admin/dealer follows up manually.
      await notifyUser(
        order.user_id,
        `Order #${req.params.id} was cancelled. Since it was already paid via eSewa, our team will process your refund manually.`,
        req.params.id
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Your order has been cancelled." });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Something went wrong while cancelling your order." });
  } finally {
    connection.release();
  }
});

module.exports = router;
