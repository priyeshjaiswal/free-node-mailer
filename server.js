require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const COUNTER_FILE = "email_count.json";

// Daily counter (in case you want logs/stats)
function initializeCounter() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    if (!fs.existsSync(COUNTER_FILE)) {
      fs.writeFileSync(COUNTER_FILE, JSON.stringify({ date: today, count: 0 }));
    } else {
      const data = JSON.parse(fs.readFileSync(COUNTER_FILE));
      if (data.date !== today) {
        fs.writeFileSync(
          COUNTER_FILE,
          JSON.stringify({ date: today, count: 0 })
        );
      }
    }
  } catch (error) {
    console.error("❌ Error initializing counter:", error.message);
    throw new Error("Failed to initialize email counter");
  }
}

function incrementCounter() {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE));
    data.count++;
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(data));
  } catch (error) {
    console.error("❌ Error incrementing counter:", error.message);
    throw new Error("Failed to increment email counter");
  }
}

// Setup Brevo transporter
const brevoTransporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: parseInt(process.env.BREVO_PORT),
  secure: process.env.BREVO_SECURE === "true",
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Setup fallback email transporter (e.g., Gmail)
const fallbackTransporter = nodemailer.createTransport({
  host: process.env.FALLBACK_HOST,
  port: parseInt(process.env.FALLBACK_PORT),
  secure: true,
  auth: {
    user: process.env.FALLBACK_USER,
    pass: process.env.FALLBACK_PASS,
  },
  connectionTimeout: 10000,
});

// Mail endpoint
app.post("/send", async (req, res) => {
  try {
    // Validate required fields
    const { provider = "", to, subject, html, sender } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields: to, subject, and html are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).send({
        success: false,
        message: "Invalid email format",
      });
    }

    initializeCounter();

    const lowerProvider = provider.toLowerCase();
    const from = sender?.email
      ? `"${sender.name || "Custom Sender"}" <${sender.email}>`
      : process.env.FROM_EMAIL;

    if (!from) {
      return res.status(400).send({
        success: false,
        message: "No sender email configured",
      });
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    if (sender?.email) {
      // Use sender email override — default to Brevo transport
      await brevoTransporter.sendMail(mailOptions);
      incrementCounter();
      console.log("📤 Sent using sender's email via Brevo.");
      return res.status(200).send({ success: true, used: "sender.email" });
    }

    if (lowerProvider === "bravo") {
      await brevoTransporter.sendMail(mailOptions);
      incrementCounter();
      console.log("📤 Email sent via Brevo.");
      return res.status(200).send({ success: true, used: "bravo" });
    }

    if (lowerProvider === "email") {
      await fallbackTransporter.sendMail(mailOptions);
      console.log("📤 Email sent via fallback.");
      return res.status(200).send({ success: true, used: "fallback" });
    }

    return res.status(400).send({
      success: false,
      message: `Invalid provider: ${provider}. Use "bravo" or "email", or provide sender.email.`,
    });
  } catch (err) {
    console.error("❌ Send error:", err.message);
    return res.status(500).send({
      success: false,
      error: err.message,
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

try {
  initializeCounter();
  app.listen(PORT, () => {
    console.log(`📨 Mailer API running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("❌ Failed to start server:", error.message);
  process.exit(1);
}
