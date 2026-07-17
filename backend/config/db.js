const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Use the CA cert from an environment variable (Render) if available,
// otherwise fall back to the local file (your PC)
const sslConfig = process.env.DB_CA_CERT
  ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: true }
  : { ca: fs.readFileSync(path.join(__dirname, "certs", "ca.pem")), rejectUnauthorized: true };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
});

module.exports = pool.promise();