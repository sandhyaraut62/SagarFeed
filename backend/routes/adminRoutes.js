const express = require("express");
const db = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("Admin"));

// GET /api/admin/stats — top-level counts for the admin overview
router.get("/stats", async (req, res) => {
  try {
    const [[{ totalDealers }]] = await db.query(
      "SELECT COUNT(*) AS totalDealers FROM users WHERE role = 'Dealer'"
    );
    const [[{ totalFarmers }]] = await db.query(
      "SELECT COUNT(*) AS totalFarmers FROM users WHERE role = 'Farmer'"
    );
    const [[{ blockedAccounts }]] = await db.query(
      "SELECT COUNT(*) AS blockedAccounts FROM users WHERE status = 'blocked'"
    );
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE order_status != 'cancelled'"
    );
    const [[{ totalProducts }]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
    const [[{ lowStockCount }]] = await db.query(
      "SELECT COUNT(*) AS lowStockCount FROM products WHERE stock_quantity <= low_stock_threshold"
    );

    res.status(200).json({
      totalDealers,
      totalFarmers,
      blockedAccounts,
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// GET /api/admin/users?role=Dealer|Farmer — list accounts, optionally filtered by role
router.get("/users", async (req, res) => {
  try {
    const { role } = req.query;
    let query = "SELECT id, full_name, email, phone, role, status, service_area, created_at FROM users WHERE role != 'Admin'";
    const params = [];
    if (role && ["Dealer", "Farmer"].includes(role)) {
      query += " AND role = ?";
      params.push(role);
    }
    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    res.status(200).json({ users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PATCH /api/admin/users/:id/status — block or unblock an account
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Please provide a valid status." });
    }

    const [target] = await db.query("SELECT role FROM users WHERE id = ?", [req.params.id]);
    if (target.length === 0) {
      return res.status(404).json({ message: "Account not found." });
    }
    if (target[0].role === "Admin") {
      return res.status(400).json({ message: "Admin accounts cannot be blocked." });
    }

    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
    res.status(200).json({ message: `Account ${status === "blocked" ? "blocked" : "unblocked"}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// PATCH /api/admin/users/:id/service-area — assign a Dealer's territory (district)
router.patch("/users/:id/service-area", async (req, res) => {
  try {
    const { serviceArea } = req.body;

    const [target] = await db.query("SELECT role FROM users WHERE id = ?", [req.params.id]);
    if (target.length === 0) {
      return res.status(404).json({ message: "Account not found." });
    }
    if (target[0].role !== "Dealer") {
      return res.status(400).json({ message: "Only Dealer accounts have a service area." });
    }

    await db.query("UPDATE users SET service_area = ? WHERE id = ?", [
      serviceArea || null,
      req.params.id,
    ]);
    res.status(200).json({ message: "Service area updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// DELETE /api/admin/users/:id — permanently remove an account
router.delete("/users/:id", async (req, res) => {
  try {
    const [target] = await db.query("SELECT role FROM users WHERE id = ?", [req.params.id]);
    if (target.length === 0) {
      return res.status(404).json({ message: "Account not found." });
    }
    if (target[0].role === "Admin") {
      return res.status(400).json({ message: "Admin accounts cannot be deleted." });
    }

    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Account deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
