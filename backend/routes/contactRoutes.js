const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, category, subject, message } = req.body;

    // Basic validation — matches what ContactPage.jsx requires
    if (!name || !phone || !category || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    await db.query(
      "INSERT INTO contact_messages (name, email, phone, category, subject, message) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, category, subject, message]
    );

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;