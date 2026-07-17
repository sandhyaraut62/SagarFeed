const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const db = require("../config/db");
const { requireAuth } = require("../middleware/authMiddleware");
const { notifyUser } = require("../utils/notify");

const router = express.Router();

// ------------------------------------------------------------------
// eSewa ePay v2 configuration.
//
// test mode uses eSewa's public UAT merchant and UAT login credentials.
// merchant credentials (see https://developer.esewa.com.np) — they only
// work against eSewa's sandbox (rc-epay.esewa.com.np) and cannot move
// real money. To go live you must:
//   1. Get a real merchant code + secret key from eSewa (merchant onboarding)
//   2. Set ESEWA_MERCHANT_CODE / ESEWA_SECRET_KEY / ESEWA_ENV=live in .env
// ------------------------------------------------------------------
const ESEWA_ENV = (process.env.ESEWA_ENV || "test").trim().toLowerCase();
const IS_ESEWA_LIVE = ESEWA_ENV === "live";
const ESEWA_MERCHANT_CODE = IS_ESEWA_LIVE
  ? (process.env.ESEWA_MERCHANT_CODE || "").trim()
  : (process.env.ESEWA_MERCHANT_CODE || "").trim() || "EPAYTEST";
const ESEWA_SECRET_KEY = IS_ESEWA_LIVE
  ? (process.env.ESEWA_SECRET_KEY || "").trim()
  : (process.env.ESEWA_SECRET_KEY || "").trim() || "8gBm/:&EnhH.1/q";
const ESEWA_CONFIG_ERROR = !["test", "live"].includes(ESEWA_ENV)
  ? "ESEWA_ENV must be either 'test' or 'live'."
  : IS_ESEWA_LIVE && (!ESEWA_MERCHANT_CODE || !ESEWA_SECRET_KEY)
    ? "eSewa live payment is not configured. Add your real ESEWA_MERCHANT_CODE and ESEWA_SECRET_KEY in backend/.env, then restart the backend."
    : null;
const ESEWA_FORM_URL =
  IS_ESEWA_LIVE
    ? "https://epay.esewa.com.np/api/epay/main/v2/form"
    : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_STATUS_URL =
  IS_ESEWA_LIVE
    ? "https://epay.esewa.com.np/api/epay/transaction/status/"
    : "https://rc.esewa.com.np/api/epay/transaction/status/";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function signFields(fieldsObject, signedFieldNames) {
  const message = signedFieldNames
    .split(",")
    .map((key) => `${key}=${fieldsObject[key]}`)
    .join(",");
  return crypto.createHmac("sha256", ESEWA_SECRET_KEY).update(message).digest("base64");
}

// POST /api/payments/esewa/initiate — build the signed form fields the
// frontend needs to auto-submit to eSewa's payment page.
router.post("/esewa/initiate", requireAuth, async (req, res) => {
  try {
    if (ESEWA_CONFIG_ERROR) {
      return res.status(500).json({ message: ESEWA_CONFIG_ERROR });
    }

    const { orderId } = req.body;
    const [[order]] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);

    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: "This isn't your order." });
    }
    if (order.payment_method !== "esewa") {
      return res.status(400).json({ message: "This order isn't set up for eSewa payment." });
    }
    if (order.payment_status === "paid") {
      return res.status(400).json({ message: "This order has already been paid." });
    }

    // transaction_uuid must be unique per payment attempt (eSewa requirement),
    // so we suffix with a timestamp to allow retries after a failed attempt.
    const transactionUuid = `sf-${order.id}-${Date.now()}`;
    const totalAmount = Number(order.total_amount).toFixed(2);

    const fields = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_MERCHANT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${FRONTEND_URL}/payment/esewa/callback`,
      failure_url: `${FRONTEND_URL}/payment/esewa/failed?orderId=${order.id}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
    fields.signature = signFields(fields, fields.signed_field_names);

    await db.query("UPDATE orders SET esewa_ref_id = ? WHERE id = ?", [transactionUuid, order.id]);

    res.status(200).json({ formUrl: ESEWA_FORM_URL, fields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not start the eSewa payment. Please try again." });
  }
});

// GET /api/payments/esewa/verify?data=... — called by the frontend after eSewa
// redirects back to success_url with a base64-encoded `data` payload.
router.get("/esewa/verify", requireAuth, async (req, res) => {
  try {
    if (ESEWA_CONFIG_ERROR) {
      return res.status(500).json({ message: ESEWA_CONFIG_ERROR });
    }

    const { data } = req.query;
    if (!data) return res.status(400).json({ message: "Missing payment confirmation data." });

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    const { transaction_uuid, total_amount, product_code, signed_field_names, signature } = decoded;

    const expectedSignature = signFields(decoded, signed_field_names);
    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Payment signature could not be verified." });
    }

    const [[order]] = await db.query("SELECT * FROM orders WHERE esewa_ref_id = ?", [
      transaction_uuid,
    ]);
    if (!order) return res.status(404).json({ message: "Order not found for this payment." });
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: "This isn't your order." });
    }

    // Double-check with eSewa's status API rather than trusting the redirect alone.
    const statusRes = await axios.get(ESEWA_STATUS_URL, {
      params: { product_code, total_amount, transaction_uuid },
    });

    if (statusRes.data?.status !== "COMPLETE") {
      return res.status(400).json({
        message: `Payment was not completed (status: ${statusRes.data?.status || "unknown"}).`,
      });
    }

    await db.query("UPDATE orders SET payment_status = 'paid' WHERE id = ?", [order.id]);
    await notifyUser(order.user_id, `Payment received for Order #${order.id} via eSewa.`, order.id);

    const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);

    res.status(200).json({
      message: "Payment verified successfully!",
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        paymentMethod: "esewa",
        paymentStatus: "paid",
        orderStatus: order.order_status,
        items,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not verify the payment. Please contact support." });
  }
});

module.exports = router;
