const express = require("express");
const db = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("Farmer", "Admin"));

// GET /api/farmer/stats — overview cards for the farmer dashboard
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user.id;
    const [[{ totalOrders }]] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders WHERE user_id = ?",
      [userId]
    );
    const [[{ activeOrders }]] = await db.query(
      "SELECT COUNT(*) AS activeOrders FROM orders WHERE user_id = ? AND order_status IN ('placed','processing','out_for_delivery')",
      [userId]
    );
    const [[{ totalSpent }]] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS totalSpent FROM orders WHERE user_id = ? AND order_status != 'cancelled'",
      [userId]
    );
    const [recentOrders] = await db.query(
      `SELECT o.id, o.total_amount, o.order_status, o.payment_method, o.created_at
       FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC LIMIT 5`,
      [userId]
    );

    res.status(200).json({ totalOrders, activeOrders, totalSpent, recentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
