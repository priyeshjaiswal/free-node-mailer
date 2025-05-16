
# 📩 Mailer Service

A flexible Node.js email service using **Brevo (formerly Sendinblue)** and **fallback SMTP (e.g., Gmail)** with smart routing logic. Supports daily email tracking and dynamic provider control via API.

---

## ✨ Features

- 📤 Send OTPs and transactional emails via Brevo or fallback email (like Gmail).
- 📦 JSON-based API with sender-level override support.
- 🔄 Daily email count tracked (extendable to limits, quotas, stats).
- 🛠 Built-in fallback mechanism for reliability.
- 🔒 Secure using `.env` and nodemailer.
- 🧰 Ready to deploy anywhere: Railway, Render, Vercel Serverless, etc.

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/priyeshjaiswal/free-node-mailer.git
cd free-node-mailer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup `.env`

Create a `.env` file at the root:

```env
PORT=5000

# BREVO credentials (https://www.brevo.com)
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_SECURE=false
BREVO_USER=your_brevo_login_email
BREVO_PASS=your_brevo_smtp_key

# Fallback (Gmail or other SMTP)
FALLBACK_HOST=smtp.gmail.com
FALLBACK_PORT=465
FALLBACK_USER=your_gmail_address
FALLBACK_PASS=your_app_password

FROM_EMAIL=no-reply@yourcompany.com
DAILY_LIMIT=300
```

---

## 📝 API Endpoint

### `POST /send`

Sends an email using either:
- `provider = "bravo"` → Brevo
- `provider = "email"` → Fallback (like Gmail)
- If `sender.email` is provided, it overrides everything.

#### 📌 JSON Body Format

```json
{
  "provider": "bravo", // or "email"
  "to": "user@example.com",
  "subject": "Your OTP Code",
  "html": "<p>Your OTP is <strong>123456</strong>. Valid for 5 minutes.</p>",
  "sender": {
    "name": "OTP Service",
    "email": "no-reply@yourcomapny.com"
  }
}
```

#### 🧠 Logic Explained

| Rule                         | Behavior                          |
|-----------------------------|-----------------------------------|
| `sender.email` exists       | Always use Brevo                  |
| `provider === "bravo"`      | Use Brevo                         |
| `provider === "email"`      | Use Fallback                      |
| None/Unknown provider       | Returns error                     |

---

## ✅ Sample CURL Usage

```bash
curl -X POST http://localhost:5000/send \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "bravo",
    "to": "receiveremail@gmail.com",
    "subject": "OTP Code",
    "html": "<p>Your OTP is <strong>000000</strong>.</p>",
    "sender": {
      "name": "OTP",
      "email": "no-reply@yourcomapny.com"
    }
  }'
```

---

## 🧾 Register on Brevo (Sendinblue)

1. Go to [https://www.brevo.com](https://www.brevo.com) and sign up.
2. Verify your account using business email and domain.
3. Go to **SMTP & API → SMTP** section:
   - Click on "Create SMTP Key".
   - Copy the key and use it in your `.env` as `BREVO_PASS`.
4. Set `BREVO_USER` as your Brevo login email.
5. Brevo SMTP host: `smtp-relay.brevo.com`
6. Port: `587`, Secure: `false`

> ⚠️ You may need to verify your sending domain (`no-reply@yourcompany.com`) under **Settings > Senders > Domains**.

---

## 🔄 Daily Counter

The service maintains a file `email_count.json` to reset and track how many emails are sent per day (can be extended to DB or metrics dashboards).
