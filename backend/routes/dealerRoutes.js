const express = require("express");
const db = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("Dealer", "Admin"));

// GET /api/dealer/stats — overview cards for the dealer dashboard
router.get("/stats", async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ pendingOrders }]] = await db.query(
      "SELECT COUNT(*) AS pendingOrders FROM orders WHERE order_status IN ('placed', 'processing')"
    );
    const [[{ totalCustomers }]] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS totalCustomers FROM orders"
    );
    const [[{ totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE order_status != 'cancelled'"
    );
    const [lowStockProducts] = await db.query(
      "SELECT id, name, category, stock_quantity, low_stock_threshold FROM products WHERE stock_quantity <= low_stock_threshold ORDER BY stock_quantity ASC"
    );
    const [recentOrders] = await db.query(
      `SELECT o.id, o.total_amount, o.order_status, o.created_at, u.full_name AS customer_name
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 8`
    );

    res.status(200).json({
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// GET /api/dealer/customers — customers who have placed orders, with order counts
router.get("/customers", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role,
              COUNT(o.id) AS order_count,
              COALESCE(SUM(o.total_amount), 0) AS total_spent,
              MAX(o.created_at) AS last_order_at
       FROM orders o
       JOIN users u ON u.id = o.user_id
       GROUP BY u.id, u.full_name, u.email, u.phone, u.role
       ORDER BY last_order_at DESC`
    );
    res.status(200).json({ customers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
