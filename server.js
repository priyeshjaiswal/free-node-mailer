// server.js
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const EMAIL_LIMIT = parseInt(process.env.DAILY_LIMIT || "300", 10);
const COUNTER_FILE = "email_count.json";

// Initialize or reset counter daily
function initializeCounter() {
  const today = new Date().toISOString().slice(0, 10);
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ date: today, count: 0 }));
  } else {
    const { date } = JSON.parse(fs.readFileSync(COUNTER_FILE));
    if (date !== today) {
      fs.writeFileSync(COUNTER_FILE, JSON.stringify({ date: today, count: 0 }));
    }
  }
}

// Load counter
function getTodayCount() {
  const { count } = JSON.parse(fs.readFileSync(COUNTER_FILE));
  return count;
}

// Increment and save
function incrementCounter() {
  const data = JSON.parse(fs.readFileSync(COUNTER_FILE));
  data.count++;
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(data));
}

// Create Brevo transporter
const brevoTransporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: parseInt(process.env.BREVO_PORT),
  secure: process.env.BREVO_SECURE === "true",
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Optional: fallback transporter
const fallbackTransporter = nodemailer.createTransport({
  host: process.env.FALLBACK_HOST,
  port: parseInt(process.env.FALLBACK_PORT),
  secure: true, // usually for Gmail (465)
  auth: {
    user: process.env.FALLBACK_USER,
    pass: process.env.FALLBACK_PASS,
  },
  connectionTimeout: 10000,
});

// Send Mail Handler
app.post("/send", async (req, res) => {
  try {
    initializeCounter();

    const count = getTodayCount();
    const { to, subject, html, sender } = req.body;

    // Construct sender email (custom or default)
    const from = sender?.email
      ? `"${sender.name || "Mailer"}" <${sender.email}>`
      : process.env.FROM_EMAIL;

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    if (count >= EMAIL_LIMIT) {
      console.log("🛑 Brevo limit reached, using fallback...");
      fallbackTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("❌ Fallback failed:", err.message);
          return res
            .status(500)
            .send({ success: false, message: "All mailers failed." });
        }
        console.log("📤 Sent via fallback:", info.response);
        return res.status(200).send({ success: true, fallback: true });
      });
    } else {
      await brevoTransporter.sendMail(mailOptions);
      incrementCounter();
      console.log(
        `✅ Email sent via Brevo. Used today: ${count + 1}/${EMAIL_LIMIT}`
      );
      return res.status(200).send({ success: true, brevo: true });
    }
  } catch (error) {
    console.error("❌ Send error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Start the server after initializing the counter
initializeCounter();
app.listen(PORT, () => {
  console.log(`📨 Mailer API running on http://localhost:${PORT}`);
});
