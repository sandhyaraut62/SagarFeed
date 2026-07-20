const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/esewa/initiate", requireAuth, async (req, res) => {
  res.status(200).json({ message: "Payments are disabled for this portfolio view." });
});

router.get("/esewa/verify", requireAuth, async (req, res) => {
  res.status(200).json({ message: "Payments are disabled for this portfolio view." });
});

module.exports = router;
