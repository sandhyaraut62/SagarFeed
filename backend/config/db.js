const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// SSL is only needed for cloud databases (e.g. Aiven, Render).
// Local MySQL (MySQL Workbench) doesn't need it, so it's skipped unless
// DB_CA_CERT or DB_USE_SSL is explicitly set.
let sslConfig = undefined;
if (process.env.DB_CA_CERT) {
  sslConfig = { ca: process.env.DB_CA_CERT, rejectUnauthorized: true };
} else if (process.env.DB_USE_SSL === "true") {
  sslConfig = {
    ca: fs.readFileSync(path.join(__dirname, "certs", "ca.pem")),
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
});

module.exports = pool.promise();