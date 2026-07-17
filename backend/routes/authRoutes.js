const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const requireAuth = require("../middleware/authMiddleware");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

// Rules checked before the /register logic runs
const registerRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("email").trim().isEmail().withMessage("Please enter a valid email address."),
  body("phone")
    .optional({ checkFalsy: true })
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number."),
  body("role")
    .isIn(["Dealer", "Farmer"])
    .withMessage("Role must be either Dealer or Farmer."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// Rules checked before the /login logic runs
const loginRules = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
];

router.post("/register", registerRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { fullName, email, phone, role, password } = req.body;

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (full_name, email, phone, role, password_hash) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, phone, role, passwordHash]
    );

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.post("/login", loginRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    if (user.status === "blocked") {
      return res.status(403).json({ message: "This account has been blocked. Please contact the Sagar Feeds admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, full_name, email, phone, role, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];
    res.status(200).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/forgot-password — request a reset link.
// Always responds with the same generic message (whether or not the email
// exists) so this endpoint can't be used to check which emails are registered.
router.post(
  "/forgot-password",
  [body("email").trim().isEmail().withMessage("Please enter a valid email address.")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email } = req.body;
      const genericMessage =
        "If an account exists for that email, a password reset link has been sent.";

      const [users] = await db.query("SELECT id, full_name FROM users WHERE email = ?", [email]);
      if (users.length === 0) {
        return res.status(200).json({ message: genericMessage });
      }

      const user = users[0];
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.query(
        "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
        [user.id, token, expiresAt]
      );

      const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

      const mailResult = await sendMail({
        to: email,
        subject: "Reset your Sagar Feeds password",
        text: `Hi ${user.full_name}, click this link to reset your password (valid for 1 hour): ${resetLink}`,
        html: `<p>Hi ${user.full_name},</p><p>Click below to reset your Sagar Feeds password. This link is valid for 1 hour.</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });

      // In dev (no SMTP configured yet), return the link directly so it can be tested
      // without setting up an email server. Remove `devResetLink` once SMTP is live.
      const payload = { message: genericMessage };
      if (!mailResult.delivered) payload.devResetLink = resetLink;

      res.status(200).json(payload);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  }
);

// POST /api/auth/reset-password — consume a reset token and set a new password.
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is missing."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { token, password } = req.body;

      const [resets] = await db.query(
        "SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > NOW()",
        [token]
      );
      if (resets.length === 0) {
        return res.status(400).json({ message: "This reset link is invalid or has expired." });
      }

      const reset = resets[0];
      const passwordHash = await bcrypt.hash(password, 10);

      await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
        passwordHash,
        reset.user_id,
      ]);
      await db.query("UPDATE password_resets SET used = 1 WHERE id = ?", [reset.id]);

      res.status(200).json({ message: "Your password has been reset. You can now log in." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  }
);

module.exports = router;