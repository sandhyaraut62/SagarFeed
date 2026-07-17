const db = require("../config/db");

async function notifyUser(userId, message, orderId = null) {
  try {
    await db.query(
      "INSERT INTO notifications (user_id, order_id, message) VALUES (?, ?, ?)",
      [userId, orderId, message]
    );
  } catch (err) {
    // Notifications are a nice-to-have; never let a failure here break the main request.
    console.error("Failed to create notification:", err);
  }
}

module.exports = { notifyUser };
