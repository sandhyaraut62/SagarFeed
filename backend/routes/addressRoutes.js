const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const addressRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("phone").trim().notEmpty().withMessage("Phone number is required."),
  body("addressLine").trim().notEmpty().withMessage("Address is required."),
  body("city").trim().notEmpty().withMessage("City/Municipality is required."),
];

// GET /api/addresses — logged-in user's saved addresses
router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC",
      [req.user.id]
    );
    res.status(200).json({ addresses: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// POST /api/addresses — add a new address
router.post("/", requireAuth, addressRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { fullName, phone, addressLine, city, district, landmark, makeDefault } = req.body;

    if (makeDefault) {
      await db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [req.user.id]);
    }

    const [result] = await db.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line, city, district, landmark, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, fullName, phone, addressLine, city, district || null, landmark || null, makeDefault ? 1 : 0]
    );

    const [rows] = await db.query("SELECT * FROM addresses WHERE id = ?", [result.insertId]);
    res.status(201).json({ message: "Address saved.", address: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// DELETE /api/addresses/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await db.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    res.status(200).json({ message: "Address removed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
